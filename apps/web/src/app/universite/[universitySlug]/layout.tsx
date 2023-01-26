import AuthCardFooter from "@/components/AuthCardFooter";
import { InfoCard, OverallRatingCard } from "@/components/Card";
import TextSwitch from "@/components/TextSwitch";
import { RateProvider } from "@/context/RateContext";
import { ratingMetaToScoresArray, ratingsToLetterGrade } from "@/lib/utils";
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
      <header className="container mx-auto max-w-6xl">
        <h1>{university.name}</h1>
      </header>
      <section>
        <header className="container mx-auto max-w-6xl space-y-8 md:flex md:gap-8 md:space-y-0 md:py-16">
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
            scores={ratingMetaToScoresArray(university.ratings as Rating[], 5)}
          />
        </header>
        <div>
          <h2 className="my-8 w-full bg-black py-8 text-center text-2xl font-bold text-white md:text-4xl">
            <TextSwitch
              links={[
                {
                  href: `/universite/${params.universitySlug}/degerlendirmeler`,
                  label: "Değerlendirmeler",
                },
                {
                  href: `/universite/${params.universitySlug}/ogretmenler`,
                  label: "Öğretmenler",
                },
              ]}
            />
          </h2>
        </div>
        <div className="container mx-auto max-w-6xl">{children}</div>
      </section>
    </main>
  );
}
