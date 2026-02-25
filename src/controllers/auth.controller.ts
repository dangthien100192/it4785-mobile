import { loginApi, registerApi } from "../models/services/auth.service";
import { useAuthStore } from "../models/store/auth.store";
import { saveMasterPasswordBiometric, clearSecureMaterial } from "../models/services/secure.service";

export async function registerController(email: string, masterPassword: string) {
  return await registerApi(email.trim(), masterPassword);
}

export async function loginController(email: string, masterPassword: string) {
  const data = await loginApi(email.trim(), masterPassword);
  console.log("Login successful, setting auth state", data);
  useAuthStore.getState().setAuth(data);
  await saveMasterPasswordBiometric(data.email, masterPassword);
  return data;
}

export async function logoutController() {
  useAuthStore.getState().clear();
  await clearSecureMaterial();
}
