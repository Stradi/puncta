import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RevalidateModule } from 'src/revalidate/revalidate.module';
import { RatingResolver } from './rating.resolver';
import { RatingService } from './rating.service';

@Module({
  providers: [RatingResolver, RatingService, PrismaModule, RevalidateModule],
  imports: [PrismaModule, RevalidateModule],
})
export class RatingModule {}
