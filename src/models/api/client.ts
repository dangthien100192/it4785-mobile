import axios from "axios";
import { Platform } from "react-native";

const DEFAULT_URL =
  Platform.OS === "android"
    ? 
    //"http://10.0.2.2:4000/api"
    "http://192.168.2.114:4000/api"
    : "http://localhost:4000/api";

export const api = axios.create({
  baseURL: DEFAULT_URL,
  timeout: 15000
});

export function setAuthToken(token: string | null) {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : "";
}
