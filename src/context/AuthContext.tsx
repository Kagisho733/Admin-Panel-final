import {
  createContext,
} from "react";

import type { AuthUser } from "../types/AuthUser";

export interface AuthContextType {

  user: AuthUser | null;

  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;


  refreshUser: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextType | null>(null);