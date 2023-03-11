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
      role
      email
      username
      isAnonymous
      university {
        slug
      }
      faculty {
        slug
      }
      ratings {
        id
        comment
        meta
        createdAt
        university {
          name
          slug
        }
        teacher {
          name
          slug
        }
      }
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
    $university: ConnectUserUniversity!
    $faculty: ConnectUserFaculty!
    $teacher: ConnectUserTeacher!
    $role: String!
  ) {
    signup(
      email: $email
      username: $username
      password: $password
      university: $university
      faculty: $faculty
      teacher: $teacher
      role: $role
    ) {
      accessToken
      refreshToken
    }
  }
`;

const EMAIL_EXISTS_QUERY = gql`
  query EmailExists($email: String!) {
    isEmailExists(email: $email) {
      result
    }
  }
`;

const USERNAME_EXISTS_QUERY = gql`
  query UsernameExists($username: String!) {
    isUsernameExists(username: $username) {
      result
    }
  }
`;

const SET_ANONYMOUSER_MUTATION = gql`
  mutation ChangeAnonymity($anonymity: Boolean!) {
    changeAnonymity(anonymity: $anonymity) {
      id
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
    return null;
  }

  if (!response.data || !response.data.login) {
    return null;
  }

  const { accessToken, refreshToken } = response.data.login;

  if (!accessToken || !refreshToken) {
    return null;
  }

  localStorage.setItem("accessToken", response.data.login.accessToken);
  localStorage.setItem("refreshToken", response.data.login.refreshToken);
  return { accessToken, refreshToken };
}

export async function getUser(accessToken: string) {
  const apolloClient = initializeApollo();

  const response = await apolloClient.query<{
    me: User;
  }>({
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
    return null;
  }

  if (!response.data || !response.data.me) {
    return null;
  }

  return response.data.me;
}

export async function getNewAccessToken(refreshToken: string) {
  const apolloClient = initializeApollo();

  const response = await apolloClient.mutate({
    mutation: REFRESH_TOKEN_MUTATION,
    variables: {
      token: refreshToken,
    },
  });

  localStorage.setItem("accessToken", response.data.refreshToken.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken.refreshToken);
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
      email: payload.email,
      username: payload.username,
      password: payload.password,
      university: {
        name: payload.university,
      },
      faculty: {
        name: payload.faculty,
      },
      teacher: {},
      role: payload.type,
    },
    errorPolicy: "ignore",
  });

  if (response.errors && response.errors.length > 0) {
    return null;
  }

  if (!response.data || !response.data.signup) {
    return null;
  }

  const { accessToken, refreshToken } = response.data.signup;

  if (!accessToken || !refreshToken) {
    return null;
  }

  localStorage.setItem("accessToken", response.data.signup.accessToken);
  localStorage.setItem("refreshToken", response.data.signup.refreshToken);

  return { accessToken, refreshToken };
}

export async function checkEmailExists(email: string) {
  const apolloClient = initializeApollo();

  const response = await apolloClient.query({
    query: EMAIL_EXISTS_QUERY,
    variables: {
      email,
    },
    errorPolicy: "ignore",
  });

  if (response.errors && response.errors.length > 0) {
    return null;
  }

  if (!response.data || !response.data.isEmailExists) {
    return null;
  }

  return response.data.isEmailExists.result;
}

export async function checkUsernameExists(username: string) {
  const apolloClient = initializeApollo();

  const response = await apolloClient.query({
    query: USERNAME_EXISTS_QUERY,
    variables: {
      username,
    },
    errorPolicy: "ignore",
  });

  if (response.errors && response.errors.length > 0) {
    return null;
  }

  if (!response.data || !response.data.isUsernameExists) {
    return null;
  }

  return response.data.isUsernameExists.result;
}

export async function changeUserAnonymity(anonymity: boolean) {
  const apolloClient = initializeApollo();

  const response = await apolloClient.mutate({
    mutation: SET_ANONYMOUSER_MUTATION,
    variables: {
      anonymity,
    },
    errorPolicy: "ignore",
  });

  if (response.errors && response.errors.length > 0) {
    return false;
  }

  if (!response.data || !response.data.changeAnonymity) {
    return false;
  }

  return true;
}
