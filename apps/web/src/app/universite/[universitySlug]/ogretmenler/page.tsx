import { CardWithRating } from "@/components/Card";
import { initializeApollo } from "@/lib/apollo";
import { gql } from "@apollo/client";

async function fetchTeachers(slug: string) {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query<{
    university: { teachers: Teacher[] }[];
  }>({
    query: gql`
      query Teachers($slug: String) {
        university(slug: $slug) {
          teachers {
            id
            name
            slug
            ratings {
              id
              score
            }
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
      {teachers.length > 0 ? (
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          {teachers.map((teacher) => (
            <CardWithRating
              key={teacher.id}
              ratings={teacher.ratings as Rating[]}
              title={teacher.name as string}
              href={`/ogretmen/${teacher.slug}`}
            />
          ))}
        </div>
      ) : (
        <p className="text-2xl font-medium">
          Bu üniversitenin henüz hiç öğretmeni bulunmamaktadır.
        </p>
      )}
    </div>
  );
}
