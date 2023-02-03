import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';

@Module({
  providers: [SearchService, SearchResolver, PrismaModule],
  imports: [PrismaModule],
})
export class SearchModule {}
