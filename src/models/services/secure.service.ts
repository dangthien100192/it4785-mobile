import * as Keychain from "react-native-keychain";
import { Platform } from "react-native";

const isAndroid = Platform.OS === "android";

// Helper: chọn mức securityLevel phù hợp
async function pickSecurityLevel() {
  // Nếu lib hỗ trợ, check supported mức nào
  // (nếu version bạn không có getSupportedBiometryType thì bỏ qua)
  try {
    // Với nhiều máy/emulator, SECURE_HARDWARE sẽ fail => dùng ANY/SECURE_SOFTWARE
    return isAndroid
      ? Keychain.SECURITY_LEVEL.SECURE_SOFTWARE
      : Keychain.SECURITY_LEVEL.ANY;
  } catch {
    return Keychain.SECURITY_LEVEL.ANY;
  }
}

/**
 * Stores masterPassword protected by biometric (Android Keystore).
 * - Emulator/dev: fallback SECURE_SOFTWARE (không ép phần cứng)
 * - Real device: vẫn dùng biometric; có thể nâng lên SECURE_HARDWARE nếu chắc máy hỗ trợ
 */
export async function saveMasterPasswordBiometric(
  email: string,
  masterPassword: string
) {
  const securityLevel = await pickSecurityLevel();

  // Emulator hay fail với BIOMETRY_CURRENT_SET + SECURE_HARDWARE
  // Dùng BIOMETRY_ANY cho “dễ thở” hơn, và không ép hardware-backed.
  await Keychain.setGenericPassword(email, masterPassword, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
    securityLevel,
  });
}

export async function getMasterPasswordAfterBiometric(): Promise<string | null> {
  const r = await Keychain.getGenericPassword({
    authenticationPrompt: {
      title: "Xác thực để xem mật khẩu",
      subtitle: "Password Vault",
      description: "Vui lòng xác thực sinh trắc",
    },
  });
  if (!r) return null;
  return r.password;
}

export async function clearSecureMaterial() {
  await Keychain.resetGenericPassword();
}