import Ratings from '@/components/pages/profil/Ratings';
import TextSwitch from '@/components/TextSwitch';
import { AuthContext } from '@/context/AuthContext';
import { initializeApollo } from '@/lib/apollo';
import { cn } from '@/lib/utils';
import { gql } from '@apollo/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();

  const [slug, setSlug] = useState<string | string[] | undefined>(router.query.slug);
  useEffect(() => {
    setSlug(router.query.slug);
  }, [router.query.slug]);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const apolloClient = initializeApollo();
      const { data } = await apolloClient.query<{ user: User }>({
        query: gql`
          query User($username: String!) {
            user(username: $username) {
              id
              username
              ratings {
                id
                comment
                meta
                createdAt
                university {
                  id
                  name
                  slug
                }
                teacher {
                  id
                  name
                  slug
                }
              }
            }
          }
        `,
        variables: {
          username: slug,
        },
        errorPolicy: 'ignore',
      });

      if (!data || !data.user) {
        setIsLoading(false);
        setError(true);
      } else {
        setUser(data.user);
        setIsLoading(false);
      }
    }

    if (!slug) return;
    fetchData();
  }, [slug]);

  const authContext = useContext(AuthContext);
  const switchLinks = [
    {
      href: `/profil/${slug}`,
      label: 'Değerlendirmeler',
    },
  ];

  if (authContext.isAuthenticated && authContext.user?.username === user?.username) {
    switchLinks.push({
      href: `/profil/${slug}/ayarlar`,
      label: 'Ayarlar',
    });
  }

  return (
    <>
      <Head>
        <title>{`Profilim | The Puncta`}</title>
      </Head>
      <div className="container mx-auto max-w-6xl">
        {!error && !isLoading && user && (
          <>
            <header className={cn('mb-8 px-4')}>
              <h2 className="text-2xl font-medium sm:text-3xl">
                <b>{user.username}</b> adlı kullanıcının profili.
              </h2>
            </header>
            <div>
              <h2 className="my-16 w-full bg-black py-8 text-center text-2xl font-bold text-white md:text-4xl">
                <TextSwitch links={switchLinks} />
              </h2>
            </div>
            <main className="px-2">{user.ratings && user.ratings.length > 0 && <Ratings ratings={user.ratings} />}</main>
          </>
        )}
        {isLoading && (
          <header className={cn('mb-8 px-4')}>
            <h2 className="text-2xl font-medium sm:text-3xl">
              <b>{slug}</b> adlı kullanıcının profili yükleniyor.
            </h2>
          </header>
        )}{' '}
        {error && (
          <header className={cn('mb-8 px-4')}>
            <h2 className="text-2xl font-medium sm:text-3xl">
              <b>{slug}</b> adında bir kullanıcı bulunamadı.
            </h2>
          </header>
        )}
      </div>
    </>
  );
}
