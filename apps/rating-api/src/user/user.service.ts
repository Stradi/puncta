import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetRatingArgs } from 'src/rating/dto/get-rating.args';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async ratings(id: number, args: GetRatingArgs) {
    return await this.prismaService.rating.findMany({
      where: {
        user: {
          id,
        },
        id: args.id,
      },
      include: {
        university: true,
        teacher: true,
      },
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }
}
