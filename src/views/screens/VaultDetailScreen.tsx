import React, { useState } from "react";
import { Alert, Linking, ScrollView, View } from "react-native";
import {
  Appbar,
  Button,
  IconButton,
  Snackbar,
  Text,
} from "react-native-paper";
import Clipboard from "@react-native-clipboard/clipboard";

import { VaultItem } from "../../models/entities/VaultItem";
import { useAuthStore } from "../../models/store/auth.store";
import { deriveKey, decryptPassword } from "../../models/services/crypto.service";
import { deleteVaultController } from "../../controllers/vault.controller";

export default function VaultDetailScreen({ route, navigation }: any) {
  const item: VaultItem = route.params.item;
  const salt = useAuthStore((s) => s.kdfSalt);

  const [plain, setPlain] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [snack, setSnack] = useState("");

  const showSnack = (message: string) => setSnack(message);

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "social":
        return "account-group";
      case "system":
        return "server";
      case "application":
        return "apps";
      case "database":
        return "database";
      default:
        return "shield-key";
    }
  };

  const revealPassword = async () => {
    setErr(null);

    if (!salt) {
      setErr("Missing kdfSalt");
      return null;
    }

    const master = "123456"; // master tạm

    try {
      const key = deriveKey(master, salt);
      const p = decryptPassword(item.passwordCipher, item.iv, key);
      setPlain(p);
      setVisible(true);
      return p;
    } catch (e: any) {
      console.error(e);
      setErr("Decrypt failed (wrong master password or data corrupted)");
      return null;
    }
  };

  const togglePassword = async () => {
    if (visible) {
      setVisible(false);
      return;
    }

    if (!plain) {
      await revealPassword();
    } else {
      setVisible(true);
    }
  };

  const handleCopy = (
    value: string | null | undefined,
    successMessage: string
  ) => {
    if (!value) {
      showSnack("Không có dữ liệu để sao chép");
      return;
    }

    Clipboard.setString(value);
    showSnack(successMessage);
  };

  const copyPassword = async () => {
    if (plain) {
      Clipboard.setString(plain);
      showSnack("Đã copy mật khẩu");
      return;
    }

    const p = await revealPassword();
    if (p) {
      Clipboard.setString(p);
      showSnack("Đã copy mật khẩu");
    }
  };

  const onDelete = async () => {
    Alert.alert("Xoá mục lưu trữ", "Bạn có chắc chắn muốn xoá mục này không?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteVaultController(item._id);
            navigation.replace("VaultList");
          } catch (e) {
            console.error(e);
            showSnack("Xoá thất bại");
          }
        },
      },
    ]);
  };

  const InfoRow = ({
    icon,
    label,
    value,
    onCopy,
    onPressValue,
    multiline = false,
  }: {
    icon: string;
    label: string;
    value?: string | null;
    onCopy?: () => void;
    onPressValue?: () => void;
    multiline?: boolean;
  }) => {
    if (!value) return null;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          gap: 8,
        }}
      >
        <IconButton icon={icon} size={20} style={{ margin: 0 }} />

        <View style={{ flex: 1 }}>
          <Text style={{ opacity: 0.6 }}>{label}</Text>
          <Text
            selectable
            onPress={onPressValue}
            style={{
              marginTop: 2,
              textDecorationLine: onPressValue ? "underline" : "none",
            }}
          >
            {value}
          </Text>
        </View>

        {onCopy && (
          <IconButton icon="content-copy" size={20} onPress={onCopy} />
        )}
      </View>
    );
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={item.title} />
          <Appbar.Action
            icon="pencil"
            onPress={() => navigation.navigate("VaultEdit", { item })}
          />
          <Appbar.Action icon="delete" onPress={onDelete} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <IconButton
              icon={getTypeIcon(item.type)}
              size={28}
              style={{ margin: 0 }}
            />
            <Text variant="titleMedium">
              Loại: {getTypeLabel(item.type)}
            </Text>
          </View>

          <InfoRow
            icon="account"
            label="Tên đăng nhập"
            value={item.username}
            onCopy={() => handleCopy(item.username, "Đã copy tên đăng nhập")}
          />

          <InfoRow
            icon="web"
            label="URL"
            value={item.url}
            onCopy={() => handleCopy(item.url, "Đã copy URL")}
            onPressValue={() => {
              if (item.url) {
                Linking.openURL(item.url).catch(console.error);
              }
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
              gap: 8,
            }}
          >
            <IconButton
              icon="form-textbox-password"
              size={20}
              style={{ margin: 0 }}
            />

            <View style={{ flex: 1 }}>
              <Text style={{ opacity: 0.6 }}>Mật khẩu</Text>
              <Text selectable style={{ marginTop: 2 }}>
                {visible ? plain ?? "" : "••••••••"}
              </Text>
            </View>

            <IconButton
              icon={visible ? "eye-off" : "eye"}
              size={20}
              onPress={togglePassword}
            />
            <IconButton
              icon="content-copy"
              size={20}
              onPress={copyPassword}
            />
          </View>

          <InfoRow
            icon="note-text"
            label="Ghi chú"
            value={item.notes}
            onCopy={() => handleCopy(item.notes, "Đã copy ghi chú")}
            multiline
          />

          {!!err && (
            <Text style={{ color: "red", marginTop: 12 }}>
              {err}
            </Text>
          )}

          <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
            <Button
              mode="contained-tonal"
              icon="pencil"
              onPress={() => navigation.navigate("VaultEdit", { item })}
              style={{ flex: 1 }}
            >
              Sửa
            </Button>

            <Button
              mode="contained"
              icon="delete"
              onPress={onDelete}
              style={{ flex: 1 }}
            >
              Xoá
            </Button>
          </View>
        </ScrollView>
      </View>

      <Snackbar
        visible={!!snack}
        onDismiss={() => setSnack("")}
        duration={1800}
      >
        {snack}
      </Snackbar>
    </>
  );
}