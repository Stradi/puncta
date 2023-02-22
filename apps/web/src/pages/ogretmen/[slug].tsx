import AuthCardFooter from "@/components/AuthCardFooter";
import Button from "@/components/Button";
import { InfoCard, OverallRatingCard } from "@/components/Card";
import Chip from "@/components/Chip";
import SingleRating from "@/components/SingleRating";
import TextSwitch from "@/components/TextSwitch";
import { AuthContext } from "@/context/AuthContext";
import { RateProvider } from "@/context/RateContext";
import { initializeApollo } from "@/lib/apollo";
import {
  mostFrequentTags,
  ratingMetaToScoresArray,
  ratingsToLetterGrade,
} from "@/lib/utils";
import { gql } from "@apollo/client";
import Head from "next/head";
import { useContext } from "react";

interface PageProps {
  teacher: Teacher;
}

export default function Page({ teacher }: PageProps) {
  const teacherName = teacher.name as string;
  const ratingCount = teacher.ratingCount as number;

  const authContext = useContext(AuthContext);

  let gradeText = "";
  if (teacher.ratings && teacher.ratings?.length > 0) {
    gradeText = `${teacherName}, toplam ${ratingCount} değerlendirme sonucu aldığı harf notu ${ratingsToLetterGrade(
      teacher.ratings
    )} olarak hesaplanmıştır.`;
  } else {
    gradeText = `${teacherName} henüz değerlendirilmediği için harf notu hesaplanamamıştır.`;
  }

  return (
    <>
      <Head>
        <title>{`${teacher.name} | The Puncta`}</title>
        <meta name="description" content={teacher.name} />
      </Head>
      <main>
        <header className="container mx-auto max-w-6xl px-4 md:flex md:gap-8">
          <div className="flex h-full w-full flex-col gap-4">
            <InfoCard
              title={teacherName}
              description={`${teacherName}, ${teacher.university?.name} üniversitesinde ${teacher.faculty?.name} bölümünde eğitim veriyor.`}
              footer={
                <>
                  <RateProvider
                    type="teacher"
                    university={
                      teacher.university as Required<
                        Pick<University, "name" | "slug">
                      >
                    }
                    faculty={
                      teacher.faculty as Required<
                        Pick<Faculty, "name" | "slug">
                      >
                    }
                    teacher={
                      teacher as Required<Pick<Teacher, "name" | "slug">>
                    }
                  >
                    <AuthCardFooter />
                  </RateProvider>
                  <div className="sm:flex sm:justify-between [&>*]:block">
                    {!authContext.isAuthenticated && (
                      <Button variant="text">{teacherName} siz misiniz?</Button>
                    )}
                    <Button variant="text">
                      Bilgilerde bir yanlışlık mı var?
                    </Button>
                  </div>
                </>
              }
            />
            <div className="my-4 ml-2 flex flex-wrap gap-2 pb-4">
              {mostFrequentTags(teacher.ratings as Rating[], 5).map((tag) => {
                const t = tag as RateTag;
                return <Chip key={t.name} label={t.localizedName} shadows />;
              })}
            </div>
          </div>
          <OverallRatingCard
            letterGrade={ratingsToLetterGrade(teacher.ratings)}
            gradeText={gradeText}
            scores={ratingMetaToScoresArray(teacher.ratings as Rating[], 10)}
          />
        </header>
        <div>
          <h2 className="my-8 w-full bg-black py-8 text-center text-2xl font-bold text-white sm:my-16 md:text-4xl">
            <TextSwitch
              links={[
                {
                  href: `/ogretmen/${teacher.slug}`,
                  label: "Değerlendirmeler",
                },
              ]}
            />
          </h2>
        </div>
        <div className="container mx-auto max-w-6xl px-4">
          <main>
            <div className="space-y-4 md:flex md:gap-4">
              <div className="space-y-4 sm:w-full md:max-w-3xl">
                {teacher.ratings && teacher.ratings.length > 0 ? (
                  teacher.ratings.map((rating) => (
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
                  <p className="text-xl font-medium sm:text-2xl">
                    <span className="font-bold">{teacherName}</span> için henüz
                    değerlendirme yapılmamış.
                  </p>
                )}
              </div>
            </div>
          </main>
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
  const { data } = await apolloClient.query<{ teacher: Teacher[] }>({
    query: gql`
      query SingleTeacher($slug: String) {
        teacher(filter: { slug: { equals: $slug } }) {
          id
          name
          slug
          ratings(sort: { createdAt: "desc" }, pageSize: 250) {
            id
            meta
            score
            comment
            createdAt
            user {
              username
            }
          }
          university {
            name
            slug
          }
          faculty {
            name
            slug
          }
          ratingCount
        }
      }
    `,
    variables: {
      slug: params.slug,
    },
  });

  return {
    props: {
      teacher: data.teacher[0],
    },
    // TODO: We should revalidate these pages every T minutes/hours.
  };
}

export function getStaticPaths() {
  return {
    paths: [],
    // We could also use `fallback: true` here and show loading state while Next.js
    // fetches the data for the page. But for now (migrating from app directory to
    // pages directory) I don't want to make extra changes to the page code.
    fallback: "blocking",
  };
}
