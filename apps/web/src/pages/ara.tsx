import { CardWithoutRating } from "@/components/Card";
import SearchInput from "@/components/pages/ara/SearchInput";
import config from "@/config";
import { searchTeacher, searchUniversity } from "@/lib/search";
import { parseQuery } from "@/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// TODO: Fix this page. It works but it's not good. For example, while having
// a query in the URL, if you click the /ara link in the navbar, it doesn't
// remove search results.
export default function Page() {
  const [term, setTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any>(undefined);
  const [hasSearched, setHasSearched] = useState(false);

  const router = useRouter();
  const query = parseQuery(router.query, ["q"]);

  function onSearch(searchTerm: string) {
    if (searchTerm !== term) {
      setTerm(searchTerm);
    }
  }

  useEffect(() => {
    setHasSearched(false);
  }, []);

  useEffect(() => {
    setTerm((query.q as string) || "");
  }, [query.q]);

  // TODO: Add loading indicator
  useEffect(() => {
    async function callApi() {
      const universities = (await searchUniversity(term)).map(
        (item: University) => ({
          name: item.name,
          slug: item.slug,
          type: "university",
        })
      );
      const teachers = (await searchTeacher(term)).map((item: Teacher) => ({
        name: item.name,
        slug: item.slug,
        type: "teacher",
      }));

      setSearchResults([...universities, ...teachers]);
    }

    if (term.length > 2) {
      router.push(
        {
          pathname: "/ara",
          query: {
            q: term,
          },
        },
        undefined,
        { shallow: true }
      );

      setSearchResults([]);
      callApi();
      setHasSearched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  return (
    <>
      <Head>
        <title>{config.site.seo.search.title}</title>
        <meta name="description" content={config.site.seo.search.description} />
      </Head>
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Arama Yap</h1>
          <p className="mx-auto w-full max-w-2xl text-xl font-medium">
            Burada öğretmenini veya üniversiteni arayabilirsin. Çıkan arama
            sonuçlarına tıklayarak da değerlendirmelerine ulaşabilirsin.
          </p>
        </div>
        <SearchInput
          className="mx-auto max-w-xl"
          placeholder="Öğretmenini veya üniversiteni ara"
          onSearch={onSearch}
          initialTerm={term}
        />
        {searchResults && searchResults.length > 0 && (
          <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0">
            {searchResults.map((result: any) => {
              const href = `/${
                result.type === "teacher" ? "ogretmen" : "universite"
              }/${result.slug}`;

              return (
                <CardWithoutRating
                  key={result.slug}
                  title={result.name}
                  href={href}
                />
              );
            })}
          </div>
        )}
        {hasSearched && searchResults && searchResults.length === 0 && (
          <div className="text-center">
            <p className="text-2xl font-medium">
              Her yeri aradık ama bulamadık. Arama terimini değiştirip tekrar
              deneyebilirsin.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
