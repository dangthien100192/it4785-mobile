import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Appbar,
  FAB,
  List,
  Chip,
  Text,
  Surface,
  ActivityIndicator,
} from "react-native-paper";
import { logoutController } from "../../controllers/auth.controller";
import { listVaultController } from "../../controllers/vault.controller";
import { VaultItem, VaultType } from "../../models/entities/VaultItem";

type FilterType = VaultType | "all";

export default function VaultListScreen({ navigation, setIsAuthed }: any) {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await listVaultController();
      setItems(data || []);
    } catch (e) {
      console.error("Load vault failed", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((x) => x.type === filter);
  }, [items, filter]);

  const getTypeLabel = (type: VaultType) => {
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

  const getTypeIcon = (type: VaultType) => {
    switch (type) {
      case "social":
        return "account-group";
      case "system":
        return "desktop-classic";
      case "application":
        return "apps";
      case "database":
        return "database";
      default:
        return "lock";
    }
  };

  const onLogout = async () => {
    await logoutController(setIsAuthed);
  };

  const chipStyle = (active: boolean) => ({
  borderRadius: 20,
  backgroundColor: active ? "#6C5CE7" : "#EDEAF7",
  });

  const chipTextStyle = (active: boolean) => ({
    color: active ? "white" : "#333",
  });

  const renderFilterChips = () => (
  <View
    style={{
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
    }}
  >
    <Chip
      icon="view-grid"
      selected={filter === "all"}
      style={chipStyle(filter === "all")}
      textStyle={chipTextStyle(filter === "all")}
      onPress={() => setFilter("all")}
    >
      Tất cả
    </Chip>

    <Chip
      icon="desktop-classic"
      selected={filter === "system"}
      style={chipStyle(filter === "system")}
      textStyle={chipTextStyle(filter === "system")}
      onPress={() => setFilter("system")}
    >
      Hệ thống
    </Chip>

    <Chip
      icon="apps"
      selected={filter === "application"}
      style={chipStyle(filter === "application")}
      textStyle={chipTextStyle(filter === "application")}
      onPress={() => setFilter("application")}
    >
      Ứng dụng
    </Chip>

    <Chip
      icon="database"
      selected={filter === "database"}
      style={chipStyle(filter === "database")}
      textStyle={chipTextStyle(filter === "database")}
      onPress={() => setFilter("database")}
    >
      CSDL
    </Chip>

    <Chip
      icon="account-group"
      selected={filter === "social"}
      style={chipStyle(filter === "social")}
      textStyle={chipTextStyle(filter === "social")}
      onPress={() => setFilter("social")}
    >
      Mạng XH
    </Chip>
  </View>
);
  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7FB" }}>
      <Appbar.Header elevated>
        <Appbar.Content title="Danh sách tài khoản" />
        <Appbar.Action icon="refresh" onPress={load} />
        <Appbar.Action icon="logout" onPress={onLogout} />
      </Appbar.Header>

      {renderFilterChips()}

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
          }}
        >
          <ActivityIndicator size="large" />
          <Text>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
            paddingTop: 4,
            flexGrow: filtered.length === 0 ? 1 : 0,
          }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 24,
              }}
            >
              <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                Chưa có tài khoản nào
              </Text>
              <Text
                variant="bodyMedium"
                style={{ opacity: 0.6, textAlign: "center" }}
              >
                Nhấn nút + để thêm tài khoản mới
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Surface
              style={{
                marginBottom: 12,
                borderRadius: 16,
                overflow: "hidden",
              }}
              elevation={1}
            >
              <List.Item
                title={item.title}
                description={`${getTypeLabel(item.type)}${
                  item.username ? " • " + item.username : ""
                }`}
                left={(props) => (
                  <List.Icon {...props} icon={getTypeIcon(item.type)} />
                )}
                right={(props) => (
                  <List.Icon {...props} icon="chevron-right" />
                )}
                onPress={() => navigation.navigate("VaultDetail", { item })}
                titleStyle={{ fontWeight: "600" }}
                descriptionStyle={{ opacity: 0.7 }}
              />
            </Surface>
          )}
        />
      )}

      <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
        }}
        onPress={() => navigation.navigate("VaultEdit", {
          item: null,
          defaultType: filter === "all" ? "system" : filter,
        })}
      />
    </View>
  );
}