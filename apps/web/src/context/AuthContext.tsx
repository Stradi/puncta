import { doLogin, getNewAccessToken, getUser } from "@/lib/auth";
import { createContext, useEffect, useState } from "react";

interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

interface AuthContextProps {
  user: Partial<User> | null;
  isAuthenticated: boolean;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

// TODO: Please fix this file. It's working but my eyes are bleeding.
interface AuthProviderProps extends React.PropsWithChildren {}
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

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

  const login = async (username: string, password: string) => {
    const response = await doLogin(username, password);
    if (!response) {
      // Username or password is wrong.
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

  const register = async (username: string, password: string) => {};

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
