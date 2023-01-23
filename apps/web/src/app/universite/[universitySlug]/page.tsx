import { InfoCard, OverallRatingCard } from "@/components/Card";
import SingleRating from "@/components/SingleRating";
import { cn, ratingsToLetterGrade } from "@/lib/utils";
import { BaseProps, fetchUniversity } from "./helpers";

export default async function Home({ params }: BaseProps) {
  const university = await fetchUniversity(params.universitySlug);
  const uniName = university.name as string;
  return (
    <div className={cn("space-y-8")}>
      <header className="space-y-8 md:flex md:gap-8 md:space-y-0 md:py-16">
        <InfoCard
          image={{
            src: "https://picsum.photos/200",
            alt: uniName,
          }}
          title={uniName}
          description={`İçerisinde ${university.faculties?.length} bölüm olan ${uniName}'nin toplam ${university.teachers?.length} öğretim üyesi bulunmaktadır.`}
          footer={<></>}
        />
        <OverallRatingCard
          letterGrade={ratingsToLetterGrade(university.ratings)}
          gradeText={`${uniName}'nin toplam ${
            university.ratings?.length
          } değerlendirme sonucu aldığı harf notu ${ratingsToLetterGrade(
            university.ratings
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
      <main>
        <h2 className="my-8 w-full bg-black py-8 text-center text-2xl font-bold text-white md:text-4xl">
          Değerlendirmeler
        </h2>
        <div className="space-y-4 md:flex md:gap-4">
          <div className="space-y-4 sm:w-full md:max-w-3xl">
            {university.ratings && university.ratings.length > 0 ? (
              university.ratings.map((rating) => (
                <SingleRating key={rating.id} {...rating} />
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
  );
}
