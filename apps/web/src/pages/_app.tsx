import NavigationBar from "@/components/NavigationBar";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import { useApollo } from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";
import "../globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo();

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
          <Component {...pageProps} />
        </ModalProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
