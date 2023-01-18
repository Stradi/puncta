import { initializeApollo } from "@/lib/apollo";
import { gql } from "@apollo/client";

async function fetchUniversity(slug: string) {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: gql`
      query SingleUniversity($slug: String) {
        university(slug: $slug) {
          id
          name
          slug
          ratings {
            id
            score
            comment
          }
        }
      }
    `,
    variables: {
      slug,
    },
  });

  return data.university[0];
}

export default async function Home({ params }: any) {
  const university = await fetchUniversity(params.universitySlug);
  return <div>{university.name}</div>;
}
