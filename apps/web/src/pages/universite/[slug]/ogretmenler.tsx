import AuthCardFooter from "@/components/AuthCardFooter";
import { CardWithRating, InfoCard, OverallRatingCard } from "@/components/Card";
import Chip from "@/components/Chip";
import TextSwitch from "@/components/TextSwitch";
import { RateProvider } from "@/context/RateContext";
import { initializeApollo } from "@/lib/apollo";
import {
  mostFrequentTags,
  ratingMetaToScoresArray,
  ratingsToLetterGrade,
} from "@/lib/utils";
import { gql } from "@apollo/client";
import Head from "next/head";

interface PageProps {
  university: University;
  slug: string;
}

export default function Page({ university, slug }: PageProps) {
  const uniName = university.name as string;
  const ratingCount = university.ratingCount as number;

  let gradeText = "";
  if (ratingCount > 0) {
    gradeText = `${uniName}'nin toplam ${ratingCount} değerlendirme sonucu aldığı harf notu ${ratingsToLetterGrade(
      university.ratings
    )} olarak hesaplanmıştır.`;
  } else {
    gradeText = `${uniName} henüz değerlendirilmediği için harf notu hesaplanamamıştır.`;
  }

  return (
    <>
      <Head>
        <title>{`${uniName} | The Puncta`}</title>
        <meta name="description" content={uniName} />
      </Head>
      <main>
        <header className="container mx-auto max-w-6xl px-4 md:flex md:gap-8">
          <div className="flex h-full w-full flex-col gap-4">
            <InfoCard
              title={uniName}
              description={`İçerisinde ${university.facultyCount} bölüm olan ${uniName}'nin toplam ${university.teacherCount} öğretim üyesi bulunmaktadır.`}
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
              image={university.image}
            />
            <div className="my-4 ml-2 flex flex-wrap gap-2 pb-4">
              {mostFrequentTags(university.ratings as Rating[], 5).map(
                (tag) => {
                  const t = tag as RateTag;
                  return <Chip key={t.name} label={t.localizedName} shadows />;
                }
              )}
            </div>
          </div>
          <OverallRatingCard
            letterGrade={ratingsToLetterGrade(university.ratings)}
            gradeText={gradeText}
            scores={ratingMetaToScoresArray(university.ratings as Rating[], 10)}
          />
        </header>
        <div>
          <h2 className="my-8 w-full bg-black py-8 text-center font-bold text-white sm:my-16 md:text-4xl">
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
        <div className="container mx-auto max-w-6xl px-2">
          <div>
            {university.teachers && university.teachers.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <p className="text-xl font-medium sm:text-2xl">
                Bu üniversitenin henüz hiç öğretmeni bulunmamaktadır.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
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
        university(filter: { slug: { equals: $slug } }) {
          id
          name
          slug
          image
          ratings {
            id
            meta
            score
            comment
            createdAt
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
          ratingCount
          facultyCount
          teacherCount
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
