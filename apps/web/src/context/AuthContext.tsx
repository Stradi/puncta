import { doLogin, doRegister, getNewAccessToken, getUser } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  university: string;
  faculty: string;
  type: "STUDENT" | "TEACHER";
}

interface AuthContextProps {
  user: Partial<User> | null;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  refetchUser: (token: string) => Promise<boolean>;
  addRatingToUser: (rating: Rating) => void;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

// TODO: Please fix this file. It's working but my eyes are bleeding.
interface AuthProviderProps extends React.PropsWithChildren {
  redirects?: {
    page: string;
    to: string;
    requireAuth: boolean;
  }[];
  disallowedRoutes?: {
    page: string;
    to: string;
    allowedRoles: string[];
  }[];
}

export function AuthProvider({
  redirects,
  disallowedRoutes,
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!redirects || redirects.length <= 0) {
      return;
    } else {
      for (const redirect of redirects) {
        if (redirect.page === pathName) {
          if (redirect.requireAuth && !isAuthenticated) {
            router.push(redirect.to || "/");
            return;
          }

          if (!redirect.requireAuth && isAuthenticated) {
            router.push(redirect.to || "/");
            return;
          }
        }
      }
    }

    if (!disallowedRoutes || disallowedRoutes.length <= 0) {
      return;
    } else {
      for (const route of disallowedRoutes) {
        if (route.page === pathName) {
          if (!user) {
            router.push(route.to);
            return;
          }

          if (!route.allowedRoles.includes(user.role as string)) {
            router.push(route.to);
            return;
          }
        }
      }
    }
  }, [pathName, router, isAuthenticated, redirects, disallowedRoutes, user]);

  // Access token or refresh token changed. We need to update the user if tokens
  // are not null.
  useEffect(() => {
    // Since both refresh and access tokens have presence or absence we can
    // check for both at the same time.

    // User is not logged in.
    if (!accessToken || !refreshToken) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    // User is logged in. Get user data.
    getUser(accessToken).then((user) => {
      if (!user) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      setIsAuthenticated(true);
      setUser(user);
    });
  }, [accessToken, refreshToken]);

  // On initial render we should only check for refresh token and it's validity
  // since access tokens are short lived.
  useEffect(() => {
    function setTokensTo(
      accessToken = null,
      refreshToken = null,
      updateState = true
    ) {
      if (!accessToken || !refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }

      if (updateState) {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
      }
    }

    const localRefreshToken = localStorage.getItem("refreshToken");

    // User is not logged in. Remove all tokens just for safety.
    if (!localRefreshToken) {
      setTokensTo();
      return;
    }

    // User previously logged in. Just remove tokens because we are
    // going to get new tokens.
    setTokensTo(null, null, false);

    // Get new access and refresh token just in case and save it to localStorage.
    getNewAccessToken(localRefreshToken).then((response) => {
      if (!response) {
        // Refresh token is invalid. User needs to login again.
        setTokensTo();
        return;
      }

      // Refresh token is valid. We got new access token.
      setTokensTo(response.accessToken, response.refreshToken);
    });
  }, []);

  const login = async (payload: LoginPayload) => {
    const response = await doLogin(payload);
    if (!response) {
      return false;
    }

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);

    const user = await refetchUser(response.accessToken);
    if (!user) {
      return false;
    }
    return true;
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser({});
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  const register = async (payload: RegisterPayload) => {
    const response = await doRegister(payload);
    if (!response) {
      // User already exists or something else
      return false;
    }

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);

    const user = await refetchUser(response.accessToken);
    if (!user) {
      return false;
    }

    return true;
  };

  const refetchUser = async (token: string) => {
    const user = await getUser(token);
    if (!user) {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }

    setUser(user);
    setIsAuthenticated(true);
    return true;
  };

  const addRatingToUser = (rating: Rating) => {
    if (!user) {
      return;
    }

    const newUser = {
      ...user,
      ratings: [...(user.ratings || []), rating],
    };
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        refetchUser,
        addRatingToUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
