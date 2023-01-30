import NavigationBar from "@/components/NavigationBar";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import { useApollo } from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import "../globals.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const apolloClient = useApollo();

  const getLayout = Component.getLayout || ((page: ReactElement) => page);

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider
        redirects={[
          {
            page: "/giris-yap",
            to: "/profil",
            requireAuth: false,
          },
          {
            page: "/kayit-ol",
            to: "/profil",
            requireAuth: false,
          },
          {
            page: "/profil",
            to: "/giris-yap",
            requireAuth: true,
          },
        ]}
      >
        <ModalProvider>
          <NavigationBar />
          {getLayout(<Component {...pageProps} />)}
        </ModalProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
