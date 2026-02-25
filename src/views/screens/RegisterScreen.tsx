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
      setMsg("Register OK. Bạn hãy login.");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text variant="headlineMedium">Đăng ký</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput label="Master Password" value={pw} onChangeText={setPw} secureTextEntry />
      {!!msg && <Text style={{ color: "green" }}>{msg}</Text>}
      {!!err && <Text style={{ color: "red" }}>{err}</Text>}
      <Button mode="contained" loading={loading} onPress={onRegister}>Register</Button>
      <Button onPress={() => navigation.goBack()}>Back</Button>
    </View>
  );
}
