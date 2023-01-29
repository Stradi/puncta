"use client";

import NavigationBar from "@/components/NavigationBar";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import { useApollo } from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apolloClient = useApollo();

  return (
    <html lang="en">
      <head />
      <body>
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
              {children}
            </ModalProvider>
          </AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
