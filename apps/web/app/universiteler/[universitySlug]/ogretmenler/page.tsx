import { initializeApollo } from "@/lib/apollo";
import { gql } from "@apollo/client";
import Link from "next/link";

async function fetchTeachers(slug: string) {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: gql`
      query Teachers($slug: String) {
        university(slug: $slug) {
          teachers {
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

  return data.university[0].teachers;
}

export default async function Home({ params }: any) {
  const teachers = await fetchTeachers(params.universitySlug);
  return (
    <div>
      {teachers.map((teacher: any) => (
        <Link href={`/ogretmenler/${teacher.slug}`} key={teacher.id}>
          {teacher.name}
        </Link>
      ))}
    </div>
  );
}
