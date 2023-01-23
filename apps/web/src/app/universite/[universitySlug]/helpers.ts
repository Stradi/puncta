import { initializeApollo } from "@/lib/apollo";
import { gql } from "@apollo/client";

export async function fetchUniversity(slug: string) {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query<{ university: University[] }>({
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
            createdAt
          }
          faculties {
            id
          }
          teachers {
            id
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

export interface BaseProps {
  params: {
    universitySlug: string;
  };
}
