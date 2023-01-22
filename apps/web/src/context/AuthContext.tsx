import { doLogin, doRegister, getNewAccessToken, getUser } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  university: string;
  faculty: string;
}

interface AuthContextProps {
  user: Partial<User> | null;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<boolean>;
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
}

export function AuthProvider({ redirects, children }: AuthProviderProps) {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!redirects || redirects.length <= 0) {
      return;
    }

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
  }, [pathName, router, isAuthenticated, redirects]);

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

    const user = await getUser(response.accessToken);
    if (!user) {
      // Probably server error.
      return false;
    }

    setUser(user);
    setIsAuthenticated(true);
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

    const user = await getUser(response.accessToken);
    if (!user) {
      // Probably server error.
      return false;
    }

    setUser(user);
    setIsAuthenticated(true);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
