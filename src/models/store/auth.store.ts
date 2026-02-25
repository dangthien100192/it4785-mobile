import { create } from "zustand";
import { setAuthToken } from "../api/client";

type AuthState = {
  token: string | null;
  email: string | null;
  kdfSalt: string | null;
  setAuth: (p: { token: string; email: string; kdfSalt: string }) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  email: null,
  kdfSalt: null,
  setAuth: ({ token, email, kdfSalt }) => {
    setAuthToken(token);
    set({ token, email, kdfSalt });
  },
  clear: () => {
    setAuthToken(null);
    set({ token: null, email: null, kdfSalt: null });
  }
}));
