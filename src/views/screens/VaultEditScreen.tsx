import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Appbar,
  Button,
  Chip,
  Surface,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native-paper";
import { VaultItem, VaultType } from "../../models/entities/VaultItem";
import {
  createVaultController,
  updateVaultController,
} from "../../controllers/vault.controller";
import { getMasterPasswordAfterBiometric } from "../../models/services/secure.service";

export default function VaultEditScreen({ route, navigation }: any) {
  const item: VaultItem | undefined = route.params?.item ?? undefined;
  const defaultType: VaultType = route.params?.defaultType ?? "system";

  const [type, setType] = useState<VaultType>(item?.type ?? defaultType);
  const [title, setTitle] = useState(item?.title ?? "");
  const [username, setUsername] = useState(item?.username ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [plainPassword, setPlainPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEdit = useMemo(() => !!item?._id, [item]);

  const onSave = async () => {
    setErr(null);
    setSaving(true);

    try {
      const master = await getMasterPasswordAfterBiometric();
      if (!master) {
        setErr("Xác thực sinh trắc học thất bại!");
        return;
      }

      if (!isEdit) {
        if (!plainPassword) {
          setErr("Vui lòng nhập mật khẩu!");
          return;
        }

        await createVaultController({
          type,
          title,
          username,
          url,
          notes,
          plainPassword,
          masterPassword: master,
        });
      } else {
        const payload: any = {
          type,
          title,
          username,
          url,
          notes,
        };

        await updateVaultController(item!._id, payload);
      }

      navigation.replace("VaultList");
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Lưu thất bại!");
    } finally {
      setSaving(false);
    }
  };

  const chipStyle = (active: boolean) => ({
  borderRadius: 20,
  backgroundColor: active ? "#6C5CE7" : "#EDEAF7",
  });

  const chipTextStyle = (active: boolean) => ({
    color: active ? "white" : "#333",
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7FB" }}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEdit ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"} />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          variant="titleMedium"
          style={{ marginBottom: 12, fontWeight: "600" }}
        >
          Loại tài khoản
        </Text>

        <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <Chip
          icon="desktop-classic"
          selected={type === "system"}
          style={chipStyle(type === "system")}
          textStyle={chipTextStyle(type === "system")}
          onPress={() => setType("system")}
        >
          Hệ thống
        </Chip>

        <Chip
          icon="apps"
          selected={type === "application"}
          style={chipStyle(type === "application")}
          textStyle={chipTextStyle(type === "application")}
          onPress={() => setType("application")}
        >
          Ứng dụng
        </Chip>

        <Chip
          icon="database"
          selected={type === "database"}
          style={chipStyle(type === "database")}
          textStyle={chipTextStyle(type === "database")}
          onPress={() => setType("database")}
        >
          CSDL
        </Chip>
        <Chip
          icon="account-group"
          selected={type === "social"}
          style={chipStyle(type === "social")}
          textStyle={chipTextStyle(type === "social")}
          onPress={() => setType("social")}
        >
          Mạng xã hội
        </Chip>
        </View>
        <Surface
          elevation={1}
          style={{
            borderRadius: 18,
            padding: 16,
            backgroundColor: "white",
          }}
        >
          <View style={{ gap: 12 }}>
            <TextInput
              mode="outlined"
              label="Tiêu đề"
              value={title}
              onChangeText={setTitle}
              left={<TextInput.Icon icon="format-title" />}
            />

            <TextInput
              mode="outlined"
              label="Tên đăng nhập"
              value={username}
              onChangeText={setUsername}
              left={<TextInput.Icon icon="account" />}
              autoCapitalize="none"
            />

            <TextInput
              mode="outlined"
              label="URL"
              value={url}
              onChangeText={setUrl}
              left={<TextInput.Icon icon="web" />}
              autoCapitalize="none"
            />

            <TextInput
              mode="outlined"
              label="Ghi chú"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              left={<TextInput.Icon icon="note-text-outline" />}
            />

            {!isEdit && (
              <TextInput
                mode="outlined"
                label="Mật khẩu"
                value={plainPassword}
                onChangeText={setPlainPassword}
                secureTextEntry
                left={<TextInput.Icon icon="lock-outline" />}
              />
            )}

            {!!err && (
              <Text style={{ color: "#C62828", marginTop: 4 }}>
                {err}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={onSave}
              disabled={saving}
              contentStyle={{ height: 48 }}
              style={{ marginTop: 4, borderRadius: 12 }}
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>

            {saving && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                <ActivityIndicator />
              </View>
            )}
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
}