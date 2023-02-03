import { Args, Query, Resolver } from '@nestjs/graphql';
import { SearchArgs } from './dto/search.args';
import { SearchResult } from './entities/search-result.entity';
import { SearchService } from './search.service';

@Resolver(() => SearchResult)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => SearchResult, { name: 'search' })
  async search(@Args() args: SearchArgs) {
    return await this.searchService.search(args);
  }
}
