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

    const master = await getMasterPasswordAfterBiometric();
    if (!master) return setErr("Biometric failed");

    try {
      const key = deriveKey(master, salt);
      const p = decryptPassword(item.passwordCipher, item.iv, item.tag, key);
      setPlain(p);
    } catch {
      setErr("Decrypt failed (wrong master password or data corrupted)");
    }
  };

  const onDelete = async () => {
    await deleteVaultController(item._id);
    navigation.replace("VaultList");
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={item.title} />
        <Appbar.Action icon="pencil" onPress={() => navigation.navigate("VaultEdit", { item })} />
      </Appbar.Header>

      <View style={{ padding: 16, gap: 10 }}>
        <Text>Type: {item.type}</Text>
        {!!item.username && <Text>Username: {item.username}</Text>}
        {!!item.url && <Text>URL: {item.url}</Text>}
        {!!item.notes && <Text>Notes: {item.notes}</Text>}

        <Button mode="contained" onPress={onReveal}>Xác thực để xem mật khẩu</Button>
        {!!plain && <Text selectable>Mật khẩu: {plain}</Text>}
        {!!err && <Text style={{ color: "red" }}>{err}</Text>}

        <Button mode="outlined" onPress={onDelete}>Xoá</Button>
      </View>
    </View>
  );
}
