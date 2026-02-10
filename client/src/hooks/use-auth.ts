import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type LoginRequest, type InsertUser } from "@shared/routes";
import { useLocation } from "wouter";

// Helper to handle JWT
const setToken = (token: string) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
const removeToken = () => localStorage.removeItem("token");

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error } = useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const token = getToken();
      if (!token) return null;
      
      const res = await fetch(api.auth.me.path, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        removeToken();
        return null;
      }
      
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.me.responses[200].parse(await res.json());
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const res = await fetch(api.auth.login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid username or password");
        throw new Error("Login failed");
      }

      const data = api.auth.login.responses[200].parse(await res.json());
      return data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData([api.auth.me.path], data.user);
      setLocation("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await fetch(api.auth.register.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }

      return api.auth.register.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData([api.auth.me.path], data.user);
      setLocation("/");
    },
  });

  const logout = () => {
    removeToken();
    queryClient.setQueryData([api.auth.me.path], null);
    setLocation("/login");
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation,
    register: registerMutation,
    logout,
  };
}
