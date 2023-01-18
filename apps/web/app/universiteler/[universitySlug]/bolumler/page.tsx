import { initializeApollo } from "@/lib/apollo";
import { gql } from "@apollo/client";
import Link from "next/link";

async function fetchFaculties(slug: string) {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: gql`
      query Faculties($slug: String) {
        university(slug: $slug) {
          faculties {
            id
            name
            slug
          }
        }
      }
    `,
    variables: {
      slug,
    },
  });

  return data.university[0].faculties;
}

export default async function Home({ params }: any) {
  const faculties = await fetchFaculties(params.universitySlug);
  return (
    <div>
      {faculties.map((faculty: any) => (
        <Link
          key={faculty.id}
          href={`/universiteler/${params.universitySlug}/${faculty.slug}`}
        >
          {faculty.name}
        </Link>
      ))}
    </div>
  );
}
