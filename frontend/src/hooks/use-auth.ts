import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiGet, apiPost, setAuthToken, getAuthToken, removeAuthToken } from "@/lib/api";
import type { User, AuthResponse, LoginRequest, RegisterRequest } from "@/types";

export { getAuthToken };

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) return null;
      
      try {
        return await apiGet<User>('/api/auth/me');
      } catch (error) {
        removeAuthToken();
        return null;
      }
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const data = await apiPost<AuthResponse>('/api/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.setQueryData(['auth', 'me'], data.user);
      setLocation("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const data = await apiPost<AuthResponse>('/api/auth/register', userData);
      return data;
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.setQueryData(['auth', 'me'], data.user);
      setLocation("/");
    },
  });

  const logout = () => {
    removeAuthToken();
    queryClient.setQueryData(['auth', 'me'], null);
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
