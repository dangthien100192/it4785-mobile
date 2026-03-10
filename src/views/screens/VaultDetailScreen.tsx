import React, { useState } from "react";
import { View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { VaultItem } from "../../models/entities/VaultItem";
import { useAuthStore } from "../../models/store/auth.store";
import { getMasterPasswordAfterBiometric } from "../../models/services/secure.service";
import { deriveKey, decryptPassword } from "../../models/services/crypto.service";
import { deleteVaultController } from "../../controllers/vault.controller";

export default function VaultDetailScreen({ route, navigation }: any) {
  const item: VaultItem = route.params.item;
  const salt = useAuthStore((s) => s.kdfSalt);
  const [plain, setPlain] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onReveal = async () => {
    setErr(null);
    setPlain(null);
    if (!salt) return setErr("Missing kdfSalt");

    // const master = await getMasterPasswordAfterBiometric();
    // if (!master) return setErr("Biometric failed");
    const master = "123456"; // bỏ biometric, dùng master tạm

    try {
      const key = deriveKey(master, salt);
      const p = decryptPassword(item.passwordCipher, item.iv, key);
      setPlain(p);
    } catch (e:any){
      console.error(e);
      setErr("Decrypt failed (wrong master password or data corrupted)");
    }
  };

  const onDelete = async () => {
    await deleteVaultController(item._id);
    navigation.replace("VaultList");
  };
  const getTypeLabel = (type: string) => {
  switch (type) {
    case "social":
      return "Mạng xã hội";
    case "system":
      return "Hệ thống";
    case "application":
      return "Ứng dụng";
    case "database":
      return "Cơ sở dữ liệu";
    default:
      return type;
  }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={item.title} />
        <Appbar.Action icon="pencil" onPress={() => navigation.navigate("VaultEdit", { item })} />
      </Appbar.Header>

      <View style={{ padding: 16, gap: 10 }}>
        <Text>Loại: {getTypeLabel(item.type)}</Text>
        {!!item.username && <Text>Tên đăng nhập: {item.username}</Text>}
        {!!item.url && <Text>URL: {item.url}</Text>}
        {!!item.notes && <Text>Ghi chú: {item.notes}</Text>}

        <Button mode="contained" onPress={onReveal}>Xem mật khẩu</Button>
        {!!plain && <Text selectable>Mật khẩu: {plain}</Text>}
        {!!err && <Text style={{ color: "red" }}>{err}</Text>}

        <Button mode="outlined" onPress={onDelete}>Xoá</Button>
      </View>
    </View>
  );
}
