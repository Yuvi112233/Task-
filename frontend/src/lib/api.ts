const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('token');
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown
): Promise<Response> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await apiRequest('GET', endpoint);
  return res.json();
}

export async function apiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  const res = await apiRequest('POST', endpoint, data);
  return res.json();
}

export async function apiPut<T>(endpoint: string, data?: unknown): Promise<T> {
  const res = await apiRequest('PUT', endpoint, data);
  return res.json();
}

export async function apiDelete(endpoint: string): Promise<void> {
  await apiRequest('DELETE', endpoint);
}
