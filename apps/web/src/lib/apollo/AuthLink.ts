import { ApolloLink } from "@apollo/client";

const authLink = new ApolloLink((operation, forward) => {
  if (typeof window === "undefined") return forward(operation);

  const accessToken = localStorage.getItem("accessToken");
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  }));

  return forward(operation);
});

export default authLink;
