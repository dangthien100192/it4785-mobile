import { createVaultApi, deleteVaultApi, listVaultApi, updateVaultApi } from "../models/services/vault.service";
import { VaultType } from "../models/entities/VaultItem";
import { useAuthStore } from "../models/store/auth.store";
import { deriveKey, encryptPassword } from "../models/services/crypto.service";

export async function listVaultController() {
  return await listVaultApi();
}

export async function createVaultController(p: {
  type: VaultType;
  title: string;
  username?: string;
  url?: string;
  notes?: string;
  plainPassword: string;
  masterPassword: string;
}) {
  const salt = useAuthStore.getState().kdfSalt;
  if (!salt) throw new Error("Missing KDF salt");

  const key = deriveKey(p.masterPassword, salt);
  const enc = encryptPassword(p.plainPassword, key);

  return await createVaultApi({
    type: p.type,
    title: p.title,
    username: p.username,
    url: p.url,
    notes: p.notes,
    ...enc
  });
}

export async function updateVaultController(id: string, payload: any) {
  return await updateVaultApi(id, payload);
}

export async function deleteVaultController(id: string) {
  return await deleteVaultApi(id);
}
