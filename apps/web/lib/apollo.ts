import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

import { useMemo } from "react";

let apolloClient: ApolloClient<NormalizedCacheObject> = null as any;

export function createApolloClient() {
  const ssrMode = typeof window === "undefined";
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    credentials: "same-origin",
  });

  return new ApolloClient({
    ssrMode,
    link: httpLink,
    cache: new InMemoryCache(),
  });
}

export function initializeApollo() {
  const client = apolloClient ?? createApolloClient();

  // Create new client for every server-side request
  if (typeof window === "undefined") {
    return client;
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = client;
  }

  return client;
}

export function useApollo() {
  const store = useMemo(() => initializeApollo(), []);
  return store;
}
