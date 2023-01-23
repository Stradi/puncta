import { InfoCard, OverallRatingCard } from "@/components/Card";
import { ratingsToLetterGrade } from "@/lib/utils";
import React from "react";
import { BaseProps, fetchUniversity } from "./helpers";

export default async function Layout({
  children,
  params,
}: BaseProps & React.PropsWithChildren) {
  const university = await fetchUniversity(params.universitySlug);
  const uniName = university.name as string;

  return (
    <main>
      <header>
        <h1>{university.name}</h1>
      </header>
      <section>
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
        <div>{children}</div>
      </section>
    </main>
  );
}
