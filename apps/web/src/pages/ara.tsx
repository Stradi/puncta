import Button from "@/components/Button";
import { CardWithoutRating } from "@/components/Card";
import SearchInput from "@/components/SearchInput";
import config from "@/config";
import { getTeachersOfUniversityFaculty } from "@/lib/search";
import { FormikProvider, useFormik } from "formik";
import Head from "next/head";
import { useState } from "react";
import * as Yup from "yup";

import faculties from "../components/pages/kayit-ol/data/faculties.json";
import universities from "../components/pages/kayit-ol/data/universities.json";

const UniversityFieldSchema = Yup.string()
  .oneOf(
    universities.map((university) => university.name),
    "Lütfen geçerli bir üniversite seçiniz."
  )
  .required("Üniversite boş bırakılamaz.");

const FacultyFieldSchema = Yup.string().when(
  ["university"],
  (university, schema) => {
    const isUniversityValid = UniversityFieldSchema.isValidSync(university);
    if (!isUniversityValid) {
      return schema;
    }

    const selectedUniversity = universities.find(
      (universityItem) => universityItem.name === university
    );

    const availableFaculties = selectedUniversity?.faculties.map(
      (facultyItem) => faculties[facultyItem]
    );

    return schema
      .oneOf(availableFaculties, "Lütfen geçerli bir bölüm seçiniz.")
      .required("Bölüm boş bırakılamaz.");
  }
);

const UniversityValidationSchema = Yup.object().shape({
  university: UniversityFieldSchema,
  faculty: FacultyFieldSchema,
});

// TODO: Fix this page. It works but it's not good. For example, while having
// a query in the URL, if you click the /ara link in the navbar, it doesn't
// remove search results.
export default function Page() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const formik = useFormik({
    initialValues: {
      university: "",
      faculty: "",
    },
    validationSchema: UniversityValidationSchema,
    onSubmit: async (values) => {
      setHasSearched(true);
      setIsLoading(true);

      const response = await getTeachersOfUniversityFaculty(
        values.university,
        values.faculty
      );

      setResults(response);
      setIsLoading(false);
    },
  });

  return (
    <>
      <Head>
        <title>{config.site.seo.search.title}</title>
        <meta name="description" content={config.site.seo.search.description} />
      </Head>
      <div className="container mx-auto max-w-6xl space-y-8 px-2">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold sm:text-4xl">Arama Yap</h1>
          <p className="mx-auto w-full max-w-2xl text-lg font-medium sm:text-xl">
            Burada öğretmenini veya üniversiteni arayabilirsin. Çıkan arama
            sonuçlarına tıklayarak da değerlendirmelerine ulaşabilirsin.
          </p>
        </div>
        <FormikProvider value={formik}>
          <div className="mx-auto flex max-w-xl flex-col gap-2">
            <SearchInput
              name="university"
              label="Üniversite"
              items={universities.map((u) => u.name)}
            />
            <SearchInput
              name="faculty"
              label="Bölüm"
              items={(function () {
                const selectedUniversity = universities.find(
                  (university) => university.name === formik.values.university
                );
                if (!selectedUniversity) {
                  return [];
                }
                return selectedUniversity.faculties.map(
                  (faculty) => faculties[faculty]
                );
              })()}
            />
            <Button type="submit" onClick={() => formik.submitForm()}>
              Ara
            </Button>
          </div>
        </FormikProvider>

        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="border-primary-dark h-16 w-16 animate-spin rounded-full border-y-2 border-r-4"></div>
              <p className="px-4 text-center text-xl font-medium text-black">
                Arama yapılıyor...
              </p>
            </div>
          </div>
        )}
        {hasSearched && !isLoading && results.length === 0 && (
          <p className="px-4 text-center text-xl font-medium text-black">
            Garip, hiç bir sonuç bulamadık. Lütfen arama kriterlerini değiştirip
            tekrar deneyin.
          </p>
        )}
        {hasSearched && !isLoading && results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold sm:text-4xl">Arama Sonuçları</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {results.map((result: any) => (
                <CardWithoutRating
                  key={result.slug}
                  title={result.name}
                  href={`/ogretmen/${result.slug}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
