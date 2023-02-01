import AuthCardFooter from "@/components/AuthCardFooter";
import Button from "@/components/Button";
import { InfoCard, OverallRatingCard } from "@/components/Card";
import SingleRating from "@/components/SingleRating";
import TextSwitch from "@/components/TextSwitch";
import { RateProvider } from "@/context/RateContext";
import { initializeApollo } from "@/lib/apollo";
import { ratingMetaToScoresArray, ratingsToLetterGrade } from "@/lib/utils";
import { gql } from "@apollo/client";

interface PageProps {
  teacher: Teacher;
}

export default function Page({ teacher }: PageProps) {
  const teacherName = teacher.name as string;

  return (
    <main>
      <header className="container mx-auto max-w-6xl md:flex md:gap-8">
        <InfoCard
          image={{
            src: "https://picsum.photos/200",
            alt: teacherName,
          }}
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
                  teacher.faculty as Required<Pick<Faculty, "name" | "slug">>
                }
                teacher={teacher as Required<Pick<Teacher, "name" | "slug">>}
              >
                <AuthCardFooter />
              </RateProvider>
              <div className="sm:flex sm:justify-between [&>*]:block">
                <Button variant="text">{teacherName} siz misiniz?</Button>
                <Button variant="text">Bilgilerde bir yanlışlık mı var?</Button>
              </div>
            </>
          }
        />
        <OverallRatingCard
          letterGrade={ratingsToLetterGrade(teacher.ratings)}
          gradeText={`${teacherName}'nin toplam ${
            teacher.ratings?.length
          } değerlendirme sonucu aldığı harf notu ${ratingsToLetterGrade(
            teacher.ratings
          )} olarak hesaplanmıştır.`}
          scores={ratingMetaToScoresArray(teacher.ratings as Rating[], 5)}
        />
      </header>
      <div>
        <h2 className="my-16 w-full bg-black py-8 text-center text-2xl font-bold text-white md:text-4xl">
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
      <div className="container mx-auto max-w-6xl">
        <main>
          <div className="space-y-4 md:flex md:gap-4">
            <div className="space-y-4 sm:w-full md:max-w-3xl">
              {teacher.ratings && teacher.ratings.length > 0 ? (
                teacher.ratings.map((rating) => (
                  <SingleRating key={rating.id} {...rating} />
                ))
              ) : (
                <p className="text-2xl font-medium">
                  <span className="font-bold">{teacherName}</span> için henüz
                  değerlendirme yapılmamış.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
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
  const { data } = await apolloClient.query<{ teacher: Teacher[] }>({
    query: gql`
      query SingleTeacher($slug: String) {
        teacher(slug: $slug) {
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
          university {
            name
            slug
          }
          faculty {
            name
            slug
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
