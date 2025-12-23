import api from "../api/api";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string; // we'll keep this hidden on UI (defaults to Employee)
}

export async function register(request: RegisterRequest): Promise<void> {
  await api.post("/auth/register", {
    ...request,
    role: request.role ?? "Employee",
  });
}

export interface LoginRequest {
  email: string;
  password: string;
}

export async function login(request: LoginRequest): Promise<void> {
  const response = await api.post("/auth/login", request);
  const token = response.data.token;

  if (!token) {
    throw new Error("No token returned from server");
  }

  localStorage.setItem("token", token);
}

export function logout(): void {
  localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}
