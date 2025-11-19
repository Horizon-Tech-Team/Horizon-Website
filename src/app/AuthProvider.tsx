"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUserClient } from "@/lib/auth";
import { Event } from "./events/page";

export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  is_verified: boolean;
  role:
    | "student"
    | "admin"
    | "superadmin"
    | "security"
    | "contingent_leader"
    | "public_relation"
    | "admin_helper";
  gender: "male" | "female" | "other"; // adjust as per your enum
  avatar: string;
  branch: string;
  year_of_study: number;
  college_name: string;
  created_at: string;
  updated_at: string;
  contingent_id?: string;
  created_events: Event[]; // optionally define a type for events if known
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  userFromServer: User | null;
}

export function AuthProvider({ children, userFromServer }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(userFromServer);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const response = await getCurrentUserClient();
      if (response?.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error refreshing user", err);
      setError("Failed to load user.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshUser(); // fetch on mount
  }, []);

  const value = {
    user,
    isLoading,
    error,
    setUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
