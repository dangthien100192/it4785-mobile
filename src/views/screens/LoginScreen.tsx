import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { loginController } from "../../controllers/auth.controller";

export default function LoginScreen({ navigation, setIsAuthed }: any) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onLogin = async () => {
    setErr(null);
    setLoading(true);
    try {
      await loginController(email, pw);

      // ✅ quan trọng: bật auth để AppNavigator render nhánh VaultList
      setIsAuthed(true);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Đăng nhập thất bại!");
      console.error("Lỗi đăng nhập!", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text variant="headlineMedium"></Text>
      <TextInput label="Tên đăng nhập" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput label="Mật khẩu" value={pw} onChangeText={setPw} secureTextEntry />
      {!!err && <Text style={{ color: "red" }}>{err}</Text>}
      <Button mode="contained" loading={loading} onPress={onLogin}>Đăng nhập</Button>
      <Button onPress={() => navigation.navigate("Register")}>Đăng ký</Button>
    </View>
  );
}