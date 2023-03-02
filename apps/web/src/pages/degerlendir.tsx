import { CardWithRating } from "@/components/Card";
import config from "@/config";
import { AuthContext } from "@/context/AuthContext";
import { getAllRateableEntities } from "@/lib/rate";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<null | {
    university: University;
    teachers: Teacher[];
  }>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      const rateableEntities = await getAllRateableEntities();
      setData(rateableEntities);
      setIsLoading(false);
    }

    if (authContext.isAuthenticated) {
      fetchData();
    }
  }, [authContext.isAuthenticated]);

  return (
    <>
      <Head>
        <title>{config.site.seo.rateable.title}</title>
        <meta
          name="description"
          content={config.site.seo.rateable.description}
        />
      </Head>
      <div className="container mx-auto max-w-6xl space-y-8 px-2">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Değerlendir</h1>
          <p className="mx-auto w-full max-w-lg text-xl font-medium">
            Burada daha önce değerlendirdiğin veya değerlendirmek istediğin bir
            şeyler olabilir.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {!isLoading && (
            <>
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
            </>
          )}
        </div>
        {isLoading && (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold">Yükleniyor...</h2>
            <div className="border-primary-darker h-16 w-16 animate-spin rounded-full border-y-2 border-r-4"></div>
          </div>
        )}
      </div>
    </>
  );
}
