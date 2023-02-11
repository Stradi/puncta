import { CardWithRating } from "@/components/Card";
import config from "@/config";
import { getAllRateableEntities } from "@/lib/rate";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<null | {
    university: University;
    teachers: Teacher[];
  }>(null);
  useEffect(() => {
    async function fetchData() {
      const rateableEntities = await getAllRateableEntities();
      setData(rateableEntities);
    }

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>{config.site.seo.rateable.title}</title>
        <meta
          name="description"
          content={config.site.seo.rateable.description}
        />
      </Head>
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Değerlendir</h1>
          <p className="mx-auto w-full max-w-lg text-xl font-medium">
            Burada daha önce değerlendirdiğin veya değerlendirmek istediğin bir
            şeyler olabilir.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CardWithRating
              title={data?.university.name as string}
              ratings={data?.university.ratings as Rating[]}
              href={`/universite/${data?.university.slug}`}
            />
          </div>
          {data?.teachers.map((teacher) => (
            <CardWithRating
              key={teacher.id}
              title={teacher.name as string}
              href={`/ogretmen/${teacher.slug}`}
              ratings={teacher.ratings as Rating[]}
            />
          ))}
        </div>
      </div>
    </>
  );
}
