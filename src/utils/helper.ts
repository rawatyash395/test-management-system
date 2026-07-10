import { createContext, useContext } from "react";

export interface User {
  name: string;
  role: string;
  userId: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userId: string, password?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const showNotification = (
  message: string,
  type: "success" | "error" | "info" = "info",
) => {
  window.dispatchEvent(
    new CustomEvent("show-notification", { detail: { message, type } }),
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
