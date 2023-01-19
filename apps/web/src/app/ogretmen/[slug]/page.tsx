import { initializeApollo } from "@/lib/apollo";
import { gql } from "@apollo/client";

async function getTeacher(slug: string) {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: gql`
      query {
        teacher {
          id
          name
          slug
        }
      }
    `,
  });

  return data.teacher[0];
}

export default async function Home({ params }: any) {
  const teacher = await getTeacher(params.slug);
  return <div>{teacher.name}</div>;
}
