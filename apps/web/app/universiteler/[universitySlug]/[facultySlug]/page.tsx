import { initializeApollo } from "@/lib/apollo";
import { gql } from "@apollo/client";

async function fetchFaculty(universitySlug: string, facultySlug: string) {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: gql`
      query Faculties($universitySlug: String, $facultySlug: String) {
        university(slug: $universitySlug) {
          faculties(slug: $facultySlug) {
            id
            name
            slug
          }
        }
      }
    `,
    variables: {
      universitySlug,
      facultySlug,
    },
  });

  return data.university[0].faculties[0];
}

export default async function Home({ params }: any) {
  const faculty = await fetchFaculty(params.universitySlug, params.facultySlug);
  return <div>{faculty.name}</div>;
}
