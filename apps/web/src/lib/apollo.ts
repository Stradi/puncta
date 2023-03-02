import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

import { useMemo } from "react";
import authLink from "./apollo/AuthLink";
import errorLink from "./apollo/ErrorLink";
import httpLink from "./apollo/HttpLink";

let apolloClient: ApolloClient<NormalizedCacheObject> = null as any;

export function createApolloClient() {
  const ssrMode = typeof window === "undefined";

  return new ApolloClient({
    ssrMode,
    link: ApolloLink.from([errorLink, authLink, httpLink]),
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
