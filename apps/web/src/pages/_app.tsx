import Footer from "@/components/Footer";
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
            to: "/",
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
          {
            page: "/degerlendir",
            to: "/giris-yap",
            requireAuth: true,
          },
        ]}
        disallowedRoutes={[
          {
            page: "/degerlendir",
            to: "/",
            allowedRoles: ["STUDENT"],
          },
          {
            page: "/degerlendirenler",
            to: "/",
            allowedRoles: ["TEACHER"],
          },
        ]}
      >
        <ModalProvider>
          <div className="space-y-16">
            <NavigationBar />
            {getLayout(<Component {...pageProps} />)}
            <Footer />
          </div>
        </ModalProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
