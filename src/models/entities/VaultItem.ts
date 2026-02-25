export type VaultType = "social" | "system" | "application" | "database";

export type VaultItem = {
  _id: string;
  type: VaultType;
  title: string;
  username?: string;
  url?: string;
  notes?: string;

  passwordCipher: string; // base64
  iv: string;             // base64
  tag: string;            // base64

  createdAt: string;
  updatedAt: string;
};
