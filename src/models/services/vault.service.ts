import { api } from "../api/client";
import { VaultItem } from "../entities/VaultItem";

export async function listVaultApi() {
  const r = await api.get("/vault");
  return r.data as VaultItem[];
}

export async function createVaultApi(payload: Partial<VaultItem> & {
  type: string; title: string; passwordCipher: string; iv: string; tag: string;
}) {
  const r = await api.post("/vault", payload);
  return r.data as VaultItem;
}

export async function updateVaultApi(id: string, payload: any) {
  const r = await api.put(`/vault/${id}`, payload);
  return r.data as VaultItem;
}

export async function deleteVaultApi(id: string) {
  const r = await api.delete(`/vault/${id}`);
  return r.data as { ok: true };
}
