import { initializeApollo } from "@/lib/apollo";
import { gql } from "@apollo/client";
import Link from "next/link";

async function fetchUniversities() {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: gql`
      query {
        university {
          id
          name
          slug
        }
      }
    `,
  });

  return data.university;
}

export default async function Home() {
  const universities = await fetchUniversities();
  return (
    <div>
      {universities.map((university: any) => (
        <Link href={`/universiteler/${university.slug}`} key={university.id}>
          {university.name}
        </Link>
      ))}
    </div>
  );
}
