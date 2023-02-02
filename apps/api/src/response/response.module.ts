import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResponseResolver } from './response.resolver';
import { ResponseService } from './response.service';

@Module({
  providers: [ResponseService, ResponseResolver, PrismaModule],
  imports: [PrismaModule],
})
export class ResponseModule {}
