import AuthCardFooter from "@/components/AuthCardFooter";
import Button from "@/components/Button";
import { InfoCard, OverallRatingCard } from "@/components/Card";
import Chip from "@/components/Chip";
import SingleRating from "@/components/SingleRating";
import TextSwitch from "@/components/TextSwitch";
import { RateProvider } from "@/context/RateContext";
import { initializeApollo } from "@/lib/apollo";
import {
  mostFrequentTags,
  ratingMetaToScoresArray,
  ratingsToLetterGrade,
} from "@/lib/utils";
import { gql } from "@apollo/client";

interface PageProps {
  university: University;
  slug: string;
}

// TODO: We probably need a layout for this.

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
            tags={mostFrequentTags(university.ratings as Rating[], 3).map(
              (tag) => {
                const t = tag as RateTag;
                return <Chip key={t.name} label={t.localizedName} />;
              }
            )}
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
          <main>
            <div className="space-y-4 md:flex md:gap-4">
              <div className="space-y-4 sm:w-full md:max-w-3xl">
                {university.ratings && university.ratings.length > 0 ? (
                  university.ratings.map((rating) => (
                    <SingleRating key={rating.id} {...rating}>
                      <p>
                        <Button
                          className="m-0 p-0"
                          variant="text"
                          asLink
                          href={`/profil/${rating.user?.username}`}
                        >
                          {rating.user?.username}
                        </Button>{" "}
                        adlı kullanıcının değerlendirmesi
                      </p>
                    </SingleRating>
                  ))
                ) : (
                  <p className="text-2xl font-medium">
                    <span className="font-bold">{uniName}</span> için henüz
                    değerlendirme yapılmamış.
                  </p>
                )}
              </div>
            </div>
          </main>
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
  const { data, errors, error } = await apolloClient.query<{
    university: University[];
  }>({
    query: gql`
      query SingleUniversity($slug: String) {
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
            user {
              username
            }
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
