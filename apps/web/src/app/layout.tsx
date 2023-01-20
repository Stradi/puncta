"use client";

import NavigationBar from "@/components/NavigationBar";
import { AuthProvider } from "@/context/AuthContext";
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
          <AuthProvider>
            <NavigationBar />
            {children}
          </AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
