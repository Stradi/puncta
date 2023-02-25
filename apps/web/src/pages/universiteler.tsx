import { CardWithImage, CardWithRating } from '@/components/Card';
import config from '@/config';
import { initializeApollo } from '@/lib/apollo';
import { cn } from '@/lib/utils';
import { gql } from '@apollo/client';
import Head from 'next/head';

interface PageProps {
  universities: University[];
}

export default function Page({ universities }: PageProps) {
  return (
    <>
      <Head>
        <title>{config.site.seo.allUniversities.title}</title>
        <meta name="description" content={config.site.seo.allUniversities.description} />
      </Head>
      <div className="container mx-auto max-w-6xl space-y-8 px-2">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Tüm Üniversiteler</h1>
          <p className="mx-auto w-full max-w-2xl text-xl font-medium">
            Burada Türkiye&apos;de bulunan tüm üniversitelerin puanlarını görebilirsin. Üniversite kutusuna tıklayarak detaylara ulaşabilirsin.
          </p>
        </div>

        <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2')}>
          {universities.map((university) => (
            <CardWithImage key={university.id} image={university.image} title={university.name as string} href={`/universite/${university.slug}`} />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query<{
    university: University[];
  }>({
    query: gql`
      query {
        university(pageSize: 500) {
          id
          name
          slug
          image
        }
      }
    `,
  });

  return {
    props: {
      universities: [...data.university].sort((a, b) => (a.name as string).localeCompare(b.name as string)),
    },
  };
}
