import { loginApi, registerApi } from "../models/services/auth.service";
import { useAuthStore } from "../models/store/auth.store";
import { saveMasterPasswordBiometric, clearSecureMaterial } from "../models/services/secure.service";
import { deriveKey } from "../models/services/crypto.service";

export async function registerController(email: string, masterPassword: string) {
  return await registerApi(email.trim(), masterPassword);
}

export async function loginController(email: string, masterPassword: string) {
  const data = await loginApi(email.trim(), masterPassword);
  console.log("Đăng nhập thành công!", data);
  useAuthStore.getState().setAuth(data);
  const key = deriveKey(masterPassword, data.kdfSalt);
  useAuthStore.getState().setDerivedKey(key);
  await saveMasterPasswordBiometric(data.email, masterPassword);
  return data;
}

export async function logoutController(setIsAuthed: (v: boolean) => void) {
  useAuthStore.getState().clear();
  await clearSecureMaterial();
  setIsAuthed(false);
}
