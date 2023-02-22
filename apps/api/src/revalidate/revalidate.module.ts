import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RevalidateService } from './revalidate.service';

@Global()
@Module({
  providers: [RevalidateService],
  exports: [RevalidateService],
  imports: [ConfigModule, HttpModule],
})
export class RevalidateModule {}
