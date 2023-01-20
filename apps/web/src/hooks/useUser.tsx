"use client";

import { initializeApollo } from "@/lib/apollo";
import { gql } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_ME_QUERY = gql`
  query {
    me {
      id
      createdAt
      updatedAt
      username
      firstName
      lastName
      role
      email
    }
  }
`;

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($token: JWT!) {
    refreshToken(token: $token) {
      accessToken
      refreshToken
    }
  }
`;

// This hooks primarily used for fetching the current logged in user by
// checking `localStorage`. It also refreshes the access token if it's expired
// or invalid.
// Also this hook should be refactored because it's doing too many things and
// it's doing them in (probably) a wrong way.
//TODO: Refactor
export default function useUser() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState(null);

  const [isRefreshTokenInvalid, setIsRefreshTokenInvalid] = useState(false);

  // Set access and refresh tokens from local storage on initial render.
  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
    setRefreshToken(localStorage.getItem("refreshToken"));
  }, []);

  // Whenever our access or refresh token changes, we want to fetch the user
  useEffect(() => {
    const apolloClient = initializeApollo();

    async function fetchAccessToken() {
      localStorage.removeItem("accessToken");

      const response = await apolloClient.mutate({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: {
          token: refreshToken,
        },
        errorPolicy: "ignore",
      });

      if (
        !response.data ||
        !response.data.refreshToken ||
        !response.data.refreshToken.accessToken ||
        !response.data.refreshToken.refreshToken
      ) {
        // Refresh token is probably invalid. We should remove it from localStorage
        // and set the `isRefreshTokenInvalid` state to true.
        localStorage.removeItem("refreshToken");
        setIsRefreshTokenInvalid(true);
        return;
      }

      setIsRefreshTokenInvalid(false);

      const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
        response.data.refreshToken;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    }

    async function fetchUser() {
      const response = await apolloClient.query({
        query: GET_ME_QUERY,
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        errorPolicy: "ignore",
      });

      if (!response.data || !response.data.me) {
        // Maybe access token is expired, try to refresh it.
        if (refreshToken) {
          fetchAccessToken();
        }
        return;
      }

      setUser(response.data.me);
    }

    // We can't fetch the user if we don't have an access token. But if we have
    // refresh token, we can try to refresh the access token.
    if (!accessToken) {
      if (!refreshToken) {
        return;
      }

      fetchAccessToken();
      return;
    }

    fetchUser();
  }, [accessToken, refreshToken]);

  return {
    user,
    isRefreshTokenInvalid,
  };
}
