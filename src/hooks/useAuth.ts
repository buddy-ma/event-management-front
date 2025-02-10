import { useState, useCallback } from "react";
import api from "@/lib/axios";
import {
  AuthResponse,
  User,
  LoginCredentials,
  RegisterCredentials,
} from "@/src/types/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = useCallback(
    async ({ email, password }: LoginCredentials) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.post<AuthResponse>("/auth/login", {
          email,
          password,
        });
        const { token, user } = response.data.data;

        localStorage.setItem("token", token);
        setUser(user);

        toast.success("Welcome back!");
        router.push("/dashboard");

        return user;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Invalid credentials";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.post<AuthResponse>(
          "/auth/register",
          credentials
        );
        const { token, user } = response.data.data;

        localStorage.setItem("token", token);
        setUser(user);

        toast.success("Registration successful!");
        router.push("/dashboard");

        return user;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Registration failed";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      setUser(null);

      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Logout failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<{ data: { user: User } }>("/auth/me");
      setUser(response.data.data.user);
      return response.data.data.user;
    } catch (err) {
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };
};
