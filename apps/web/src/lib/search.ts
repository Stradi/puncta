import { gql } from "@apollo/client";
import { initializeApollo } from "./apollo";

const SEARCH_QUERY = gql`
  query Search($term: String!) {
    search(query: $term) {
      count
      results {
        name
        slug
        type
      }
    }
  }
`;

export async function searchTerm(term: string) {
  // TODO: We should slugify the term here or in the page...
  const apolloClient = initializeApollo();

  const response = await apolloClient.query({
    query: SEARCH_QUERY,
    variables: {
      term,
    },
  });

  if (response.errors && response.errors.length > 0) {
    console.log("Something happened while registering.");
    console.log(response.errors);
    return null;
  }

  if (!response.data || !response.data.search) {
    return null;
  }

  return response.data.search;
}
