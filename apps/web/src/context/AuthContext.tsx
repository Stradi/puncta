import {
  changeUserAnonymity,
  doLogin,
  doRegister,
  getNewAccessToken,
  getUser,
} from "@/lib/auth";
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
  isFetching: boolean;

  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  refetchUser: (token: string) => Promise<boolean>;
  addRatingToUser: (rating: Rating) => void;

  setAnonymity: (anonymity: boolean) => Promise<boolean>;
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
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("accessToken") &&
      localStorage.getItem("refreshToken")
    ) {
      setAccessToken(localStorage.getItem("accessToken"));
      setRefreshToken(localStorage.getItem("refreshToken"));
    }
  }, []);

  useEffect(() => {
    // User is not logged in.
    if (!accessToken || !refreshToken) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    refetchUser(accessToken);
  }, [accessToken, refreshToken]);

  const login = async (payload: LoginPayload) => {
    const response = await doLogin(payload);
    if (!response) {
      return false;
    }

    const user = await refetchUser(response.accessToken);
    if (!user) {
      return false;
    }
    return true;
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
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

    const user = await refetchUser(response.accessToken);
    if (!user) {
      return false;
    }

    return true;
  };

  const refetchUser = async (token: string) => {
    setIsFetching(true);
    const user = await getUser(token);
    if (!user) {
      setUser(null);
      setIsAuthenticated(false);
      setIsFetching(false);
      return false;
    }

    setUser(user);
    setIsAuthenticated(true);
    setIsFetching(false);
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

  async function setAnonymity(anonymity: boolean) {
    if (!user) {
      return false;
    }

    if (user.isAnonymous === anonymity) {
      return false;
    }
    const response = await changeUserAnonymity(anonymity);
    if (!response) {
      return false;
    }
    const newUser = {
      ...user,
      isAnonymous: anonymity,
    };

    setUser(newUser);
    return true;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isFetching,
        login,
        logout,
        register,
        refetchUser,
        addRatingToUser,
        setAnonymity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
