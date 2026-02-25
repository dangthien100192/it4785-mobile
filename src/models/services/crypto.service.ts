import "react-native-get-random-values";
import CryptoJS from "crypto-js";

function fromB64(b64: string) {
  return CryptoJS.enc.Base64.parse(b64);
}
function toB64(wordArray: CryptoJS.lib.WordArray) {
  return CryptoJS.enc.Base64.stringify(wordArray);
}

export function deriveKey(masterPassword: string, kdfSaltB64: string) {
  const salt = fromB64(kdfSaltB64);
  const key = CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 32 / 4, // 32 bytes
    iterations: 150000,
    hasher: CryptoJS.algo.SHA256,
  });
  return key;
}

export function encryptPassword(plain: string, key: CryptoJS.lib.WordArray) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const enc = CryptoJS.AES.encrypt(plain, key, { iv });
  return {
    ivB64: toB64(iv),
    ctB64: enc.ciphertext.toString(CryptoJS.enc.Base64),
  };
}

export function decryptPassword(ctB64: string, ivB64: string, key: CryptoJS.lib.WordArray) {
  const iv = fromB64(ivB64);
  const ciphertext = fromB64(ctB64);
  const dec = CryptoJS.AES.decrypt({ ciphertext } as any, key, { iv });
  return dec.toString(CryptoJS.enc.Utf8);
}