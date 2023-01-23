import { CardWithRating } from "@/components/Card";
import { initializeApollo } from "@/lib/apollo";
import { cn } from "@/lib/utils";
import { gql } from "@apollo/client";

async function fetchUniversities() {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query<{
    university: University[];
  }>({
    query: gql`
      query {
        university {
          id
          name
          slug
          faculties {
            id
            name
            slug
          }
          teachers {
            id
            name
            slug
          }
          ratings {
            id
            score
            comment
          }
        }
      }
    `,
  });

  return data.university;
}

export default async function Page() {
  const universities = await fetchUniversities();
  return (
    <div className="space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Tüm Üniversiteler</h1>
        <p className="mx-auto w-full max-w-2xl text-xl font-medium">
          Burada Türkiye&apos;de bulunan tüm üniversitelerin puanlarını
          görebilirsin. Üniversite kutusuna tıklayarak detaylara ulaşabilirsin.
        </p>
      </div>

      <div
        className={cn("space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0")}
      >
        {universities.map((university) => (
          <CardWithRating
            key={university.id}
            ratings={university.ratings as Rating[]}
            title={university.name as string}
            href={`/universite/${university.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
