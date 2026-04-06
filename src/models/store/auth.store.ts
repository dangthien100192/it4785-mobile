import { create } from "zustand";
import { setAuthToken } from "../api/client";
import CryptoJS from "crypto-js";

type AuthState = {
  token: string | null;
  email: string | null;
  kdfSalt: string | null;
  derivedKey: CryptoJS.lib.WordArray | null;
  setAuth: (p: { token: string; email: string; kdfSalt: string }) => void;
  setDerivedKey: (key: CryptoJS.lib.WordArray) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  email: null,
  kdfSalt: null,
  derivedKey: null,
  setAuth: ({ token, email, kdfSalt }) => {
    setAuthToken(token);
    set({ token, email, kdfSalt });
  },

  setDerivedKey: (derivedKey) => {
    set({ derivedKey });
  },

  clear: () => {
    setAuthToken(null);
    set({ token: null, email: null, kdfSalt: null, derivedKey: null });
  }
}));
