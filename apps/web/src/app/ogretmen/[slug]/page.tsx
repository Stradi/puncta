import AuthCardFooter from "@/components/AuthCardFooter";
import Button from "@/components/Button";
import { InfoCard, OverallRatingCard } from "@/components/Card";
import SingleRating from "@/components/SingleRating";
import TextSwitch from "@/components/TextSwitch";
import { initializeApollo } from "@/lib/apollo";
import { ratingsToLetterGrade } from "@/lib/utils";
import { gql } from "@apollo/client";

async function getTeacher(slug: string) {
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
      slug,
    },
  });

  return data.teacher[0];
}

export default async function Home({ params }: any) {
  const teacher = await getTeacher(params.slug);
  const teacherName = teacher.name as string;

  return (
    <main>
      <header className="container mx-auto max-w-6xl">
        <h1>{teacherName}</h1>
      </header>
      <section>
        <header className="container mx-auto max-w-6xl space-y-8 md:flex md:gap-8 md:space-y-0 md:py-16">
          <InfoCard
            image={{
              src: "https://picsum.photos/200",
              alt: teacherName,
            }}
            title={teacherName}
            description={`${teacherName}, ${teacher.university?.name} üniversitesinde ${teacher.faculty?.name} bölümünde eğitim veriyor.`}
            footer={
              <>
                <AuthCardFooter
                  type="teacher"
                  universitySlug={teacher.university?.slug as string}
                  facultySlug={teacher.faculty?.slug as string}
                />
                <div className="sm:flex sm:justify-between [&>*]:block">
                  <Button variant="text">{teacherName} siz misiniz?</Button>
                  <Button variant="text">
                    Bilgilerde bir yanlışlık mı var?
                  </Button>
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
            scores={[
              {
                category: "Eğitim",
                info: "Kurumun genel öğretim kadrosu ve verilen eğitim kalitesi",
                max: 100,
                value: 65,
              },
              {
                category: "Prestij",
                info: "Kurumun genel itibarını, bilinirliğini, tanınırlığını ve referans anlamındaki değerini",
                max: 100,
                value: 100,
              },
              {
                category: "İmkanlar",
                info: "Öğrenciye sağlanan ayrıcalıklar, indirimler, yardımlar veya staj potansiyelleri",
                max: 100,
                value: 77,
              },
              {
                category: "Altyapı",
                info: "Kurumun ısınma, havalandırma, yaz ve kız şartlarına uygun olarak aldığı aksiyonları, internet ve teknolojiye uygunluğu",
                max: 100,
                value: 24,
              },
              {
                category: "Güvenlik",
                info: "Kurumun genel güvenliği, güvenlik ekibi ve güvenlik protokolleri",
                max: 100,
                value: 10,
              },
            ]}
          />
        </header>
        <div>
          <h2 className="my-8 w-full bg-black py-8 text-center text-2xl font-bold text-white md:text-4xl">
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
      </section>
    </main>
  );
}
