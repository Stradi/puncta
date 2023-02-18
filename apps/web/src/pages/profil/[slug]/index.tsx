import Ratings from "@/components/pages/profil/Ratings";
import TextSwitch from "@/components/TextSwitch";
import { AuthContext } from "@/context/AuthContext";
import { initializeApollo } from "@/lib/apollo";
import { cn } from "@/lib/utils";
import { gql } from "@apollo/client";
import Head from "next/head";
import { useContext } from "react";

interface PageProps {
  user: User;
  slug: string;
}

export default function Page({ user, slug }: PageProps) {
  const authContext = useContext(AuthContext);
  const switchLinks = [
    {
      href: `/profil/${slug}`,
      label: "Değerlendirmeler",
    },
  ];

  if (
    authContext.isAuthenticated &&
    authContext.user?.username === user.username
  ) {
    switchLinks.push({
      href: `/profil/${slug}/ayarlar`,
      label: "Ayarlar",
    });
  }

  return (
    <>
      <Head>
        <title>{`Profilim | The Puncta`}</title>
      </Head>
      <div className="container mx-auto max-w-6xl">
        <header className={cn("mb-8")}>
          <h2 className="text-3xl font-medium">
            <b>{user.username}</b> adlı kullanıcının profili.
          </h2>
        </header>
        <div>
          <h2 className="my-16 w-full bg-black py-8 text-center text-2xl font-bold text-white md:text-4xl">
            <TextSwitch links={switchLinks} />
          </h2>
        </div>
        <main>
          {user.ratings && user.ratings.length > 0 && (
            <Ratings ratings={user.ratings} />
          )}
        </main>
      </div>
    </>
  );
}

interface Params {
  params: {
    slug: string;
  };
}

export async function getStaticProps({ params }: Params) {
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
      username: params.slug,
    },
    errorPolicy: "ignore",
  });

  if (!data || !data.user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: data.user,
      slug: params.slug,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
