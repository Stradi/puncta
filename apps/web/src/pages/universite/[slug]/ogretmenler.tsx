import AuthCardFooter from "@/components/AuthCardFooter";
import { CardWithRating, InfoCard, OverallRatingCard } from "@/components/Card";
import TextSwitch from "@/components/TextSwitch";
import { RateProvider } from "@/context/RateContext";
import { initializeApollo } from "@/lib/apollo";
import { ratingMetaToScoresArray, ratingsToLetterGrade } from "@/lib/utils";
import { gql } from "@apollo/client";

interface PageProps {
  university: University;
  slug: string;
}

export default function Page({ university, slug }: PageProps) {
  const uniName = university.name as string;

  return (
    <main>
      <section>
        <header className="container mx-auto max-w-6xl md:flex md:gap-8">
          <InfoCard
            image={{
              src: "https://picsum.photos/200",
              alt: uniName,
            }}
            title={uniName}
            description={`İçerisinde ${university.faculties?.length} bölüm olan ${uniName}'nin toplam ${university.teachers?.length} öğretim üyesi bulunmaktadır.`}
            footer={
              <RateProvider
                type="university"
                university={
                  university as Required<Pick<University, "name" | "slug">>
                }
              >
                <AuthCardFooter />
              </RateProvider>
            }
          />
          <OverallRatingCard
            letterGrade={ratingsToLetterGrade(university.ratings)}
            gradeText={`${uniName}'nin toplam ${
              university.ratings?.length
            } değerlendirme sonucu aldığı harf notu ${ratingsToLetterGrade(
              university.ratings
            )} olarak hesaplanmıştır.`}
            scores={ratingMetaToScoresArray(university.ratings as Rating[], 10)}
          />
        </header>
        <div>
          <h2 className="my-16 w-full bg-black py-8 text-center font-bold text-white md:text-4xl">
            <TextSwitch
              links={[
                {
                  href: `/universite/${slug}/degerlendirmeler`,
                  label: "Değerlendirmeler",
                },
                {
                  href: `/universite/${slug}/ogretmenler`,
                  label: "Öğretmenler",
                },
              ]}
            />
          </h2>
        </div>
        <div className="container mx-auto max-w-6xl">
          <div>
            {university.teachers && university.teachers.length > 0 ? (
              <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
                {university.teachers?.map((teacher) => (
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
        </div>
      </section>
    </main>
  );
}

interface Params {
  params: {
    slug: string;
  };
}

export async function getStaticProps({ params }: Params) {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query<{ university: University[] }>({
    query: gql`
      query SingleUniversityWithTeacher($slug: String) {
        university(slug: $slug) {
          id
          name
          slug
          ratings {
            id
            meta
            score
            comment
            createdAt
          }
          faculties {
            id
          }
          teachers {
            id
            name
            slug
            ratings {
              id
              meta
              score
            }
          }
        }
      }
    `,
    variables: {
      slug: params.slug,
    },
  });

  return {
    props: {
      university: data.university[0],
      slug: params.slug,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
