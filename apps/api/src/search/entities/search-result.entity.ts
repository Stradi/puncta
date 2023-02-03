import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SearchResultItem {
  @Field(() => String, { description: 'Item name' })
  name: string;

  @Field(() => String, { description: 'Item slug' })
  slug: string;

  @Field(() => String, { description: 'Item type' })
  type: string;
}

@ObjectType()
export class SearchResult {
  @Field(() => Int, { description: 'Number of results' })
  count: number;

  @Field(() => [SearchResultItem], { description: 'Results' })
  results: SearchResultItem[];
}
