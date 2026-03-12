import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { registerController } from "../../controllers/auth.controller";

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onRegister = async () => {
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      await registerController(email, pw);
      setMsg("Đăng ký thành công!");
    } catch (e: any) {
      console.error("Lỗi đăng ký!", e);
      setErr(e?.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text variant="headlineMedium">Đăng ký</Text>
      <TextInput label="Tên đăng nhập" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput label="Mật khâu" value={pw} onChangeText={setPw} secureTextEntry />
      {!!msg && <Text style={{ color: "green" }}>{msg}</Text>}
      {!!err && <Text style={{ color: "red" }}>{err}</Text>}
      <Button mode="contained" loading={loading} onPress={onRegister}>Đăng ký</Button>
      <Button onPress={() => navigation.goBack()}>Quay lại</Button>
    </View>
  );
}
