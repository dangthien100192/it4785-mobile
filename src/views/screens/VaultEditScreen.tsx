import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Appbar, Button, Text, TextInput, SegmentedButtons } from "react-native-paper";
import { VaultItem, VaultType } from "../../models/entities/VaultItem";
import { createVaultController, updateVaultController } from "../../controllers/vault.controller";
import { getMasterPasswordAfterBiometric } from "../../models/services/secure.service";

export default function VaultEditScreen({ route, navigation }: any) {
  const item: VaultItem | undefined = route.params?.item;

  const [type, setType] = useState<VaultType>(item?.type ?? "social");
  const [title, setTitle] = useState(item?.title ?? "");
  const [username, setUsername] = useState(item?.username ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [plainPassword, setPlainPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const isEdit = useMemo(() => !!item?._id, [item]);

  const onSave = async () => {
    setErr(null);

    const master = await getMasterPasswordAfterBiometric();
    if (!master) return setErr("Biometric failed");

    try {
      if (!isEdit) {
        if (!plainPassword) return setErr("Password is required");
        await createVaultController({
          type, title, username, url, notes,
          plainPassword,
          masterPassword: master
        });
      } else {
        const payload: any = { type, title, username, url, notes };
        await updateVaultController(item!._id, payload);
      }
      navigation.replace("VaultList");
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Save failed");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEdit ? "Edit Item" : "Create Item"} />
      </Appbar.Header>

      <View style={{ padding: 16, gap: 10 }}>
        <SegmentedButtons
          value={type}
          onValueChange={(v) => setType(v as VaultType)}
          buttons={[
            { value: "social", label: "Social" },
            { value: "system", label: "System" },
            { value: "application", label: "App" },
            { value: "database", label: "DB" }
          ]}
        />

        <TextInput label="Title" value={title} onChangeText={setTitle} />
        <TextInput label="Username" value={username} onChangeText={setUsername} />
        <TextInput label="URL" value={url} onChangeText={setUrl} />
        <TextInput label="Notes" value={notes} onChangeText={setNotes} multiline />

        {!isEdit && (
          <TextInput label="Password" value={plainPassword} onChangeText={setPlainPassword} secureTextEntry />
        )}

        {!!err && <Text style={{ color: "red" }}>{err}</Text>}
        <Button mode="contained" onPress={onSave}>Save</Button>
      </View>
    </View>
  );
}
