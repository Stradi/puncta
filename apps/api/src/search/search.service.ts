import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchArgs } from './dto/search.args';

@Injectable()
export class SearchService {
  constructor(private prismaService: PrismaService) {}

  async search(args: SearchArgs) {
    const teachers = await this.searchResource(args, 'teacher');
    const universities = await this.searchResource(args, 'university');

    return {
      count: teachers.length + universities.length,
      results: [...teachers, ...universities],
    };
  }

  private async searchResource(
    args: SearchArgs,
    resource: 'teacher' | 'university',
  ) {
    // Currently I am planning to send slugified query to the database
    // since in development I am using sqlite and it doesn't support
    // full text search. In production I will use postgres and will
    // change that (if I don't forget).
    const result = await (this.prismaService[resource] as any).findMany({
      where: {
        slug: {
          contains: args.query,
        },
      },
    });

    return result.map((item: any) => ({
      name: item.name,
      slug: item.slug,
      type: resource,
    }));
  }
}
