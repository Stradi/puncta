import { onError } from "@apollo/client/link/error";
import { fromPromise } from "@apollo/client";
import { getNewAccessToken } from "../auth";

let isRefreshing = false;
let pendingRequests: Function[] = [];

function setIsRefreshing(value: boolean) {
  isRefreshing = value;
}

function addPendingRequest(request: Function) {
  pendingRequests.push(request);
}

function resolvePendingRequests() {
  pendingRequests.map((request) => request());
  pendingRequests = [];
}

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!graphQLErrors) {
    return;
  }

  if (
    !graphQLErrors.some((error) => error.extensions.code === "UNAUTHENTICATED")
  ) {
    return;
  }

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return;
  }

  if (isRefreshing) {
    return fromPromise(
      new Promise((resolve) => {
        addPendingRequest(() => resolve(forward(operation)));
      })
    ).flatMap(() => forward(operation));
  }

  setIsRefreshing(true);
  return fromPromise(
    getNewAccessToken(refreshToken).catch(() => {
      resolvePendingRequests();
      setIsRefreshing(false);

      localStorage.clear();

      return forward(operation);
    })
  ).flatMap(() => {
    resolvePendingRequests();
    setIsRefreshing(false);

    return forward(operation);
  });
});

export default errorLink;
