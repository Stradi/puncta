import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserNotFoundError } from 'src/shared/shared.exceptions';
import { GetUserArgs } from './dto/get-user.args';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async find(args: GetUserArgs) {
    let user = null;
    user = await this.prismaService.user.findUnique({
      where: {
        username: args.username,
      },
    });

    if (!user) {
      throw UserNotFoundError;
    }

    return user;
  }

  async ratings(id: number) {
    return await this.prismaService.user
      .findUnique({
        where: { id },
      })
      .ratings();
  }

  async ratingCount(id: number) {
    return await this.prismaService.rating.count({
      where: {
        userId: id,
      },
    });
  }

  async university(id: number) {
    return await this.prismaService.user
      .findUnique({
        where: { id },
      })
      .university();
  }

  async faculty(id: number) {
    return await this.prismaService.user
      .findUnique({
        where: { id },
      })
      .faculty();
  }

  async response(id: number) {
    return await this.prismaService.user
      .findUnique({
        where: { id },
      })
      .responses();
  }

  async responseCount(id: number) {
    return await this.prismaService.response.count({
      where: {
        fromId: id,
      },
    });
  }
}
