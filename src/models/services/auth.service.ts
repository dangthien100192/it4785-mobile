import { api } from "../api/client";

export async function registerApi(email: string, masterPassword: string) {
  const r = await api.post("/auth/register", { email, masterPassword });
  return r.data as { id: string; email: string; kdfSalt: string };
}

export async function loginApi(email: string, masterPassword: string) {
  const r = await api.post("/auth/login", { email, masterPassword });
  return r.data as { token: string; email: string; kdfSalt: string };
}
