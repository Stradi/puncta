import { LoginPayload, RegisterPayload } from "@/context/AuthContext";
import { gql } from "@apollo/client";
import { initializeApollo } from "./apollo";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

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

const REGISTER_MUTATION = gql`
  mutation Signup(
    $email: String!
    $username: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $university: ConnectUserUniversity!
    $faculty: ConnectUserFaculty!
  ) {
    signup(
      email: $email
      username: $username
      password: $password
      firstName: $firstName
      lastName: $lastName
      university: $university
      faculty: $faculty
    ) {
      accessToken
      refreshToken
    }
  }
`;

export async function doLogin(payload: LoginPayload) {
  const apolloClient = initializeApollo();

  const response = await apolloClient.mutate({
    mutation: LOGIN_MUTATION,
    variables: {
      username: payload.username,
      password: payload.password,
    },
    errorPolicy: "ignore",
  });

  if (response.errors && response.errors.length > 0) {
    console.log("Something happened while logging in.");
    console.log(response.errors);
    return null;
  }

  if (!response.data || !response.data.login) {
    return null;
  }

  const { accessToken, refreshToken } = response.data.login;

  if (!accessToken || !refreshToken) {
    console.log("Access token or refresh token doesn't exists.");
    console.log(response.data.login);
    return null;
  }

  return { accessToken, refreshToken };
}

export async function getUser(accessToken: string) {
  const apolloClient = initializeApollo();

  const response = await apolloClient.query({
    query: GET_ME_QUERY,
    context: {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
    errorPolicy: "ignore",
  });

  // Probably access token is expired.
  if (response.errors && response.errors.length > 0) {
    console.log("Something happened while getting user.");
    console.log(response.errors);
    return null;
  }

  if (!response.data || !response.data.me) {
    return null;
  }

  console.log(response.data);

  return response.data.me;
}

export async function getNewAccessToken(refreshToken: string) {
  const apolloClient = initializeApollo();

  const response = await apolloClient.mutate({
    mutation: REFRESH_TOKEN_MUTATION,
    variables: {
      token: refreshToken,
    },
    errorPolicy: "ignore",
  });

  if (response.errors && response.errors.length > 0) {
    console.log("Something happened while refreshing token.");
    console.log(response.errors);
    return null;
  }

  if (!response.data || !response.data.refreshToken) {
    return null;
  }

  return {
    accessToken: response.data.refreshToken.accessToken,
    refreshToken: response.data.refreshToken.refreshToken,
  };
}

export async function doRegister(payload: RegisterPayload) {
  const apolloClient = initializeApollo();

  const response = await apolloClient.mutate({
    mutation: REGISTER_MUTATION,
    variables: {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
      university: {
        name: payload.university,
      },
      faculty: {
        name: payload.faculty,
      },
    },
    errorPolicy: "ignore",
  });

  if (response.errors && response.errors.length > 0) {
    console.log("Something happened while registering.");
    console.log(response.errors);
    return null;
  }

  if (!response.data || !response.data.signup) {
    return null;
  }

  const { accessToken, refreshToken } = response.data.signup;

  if (!accessToken || !refreshToken) {
    console.log("Access token or refresh token doesn't exists.");
    console.log(response.data.signup);
    return null;
  }

  return { accessToken, refreshToken };
}
