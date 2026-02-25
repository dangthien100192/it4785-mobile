import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Appbar, FAB, List, SegmentedButtons } from "react-native-paper";
import { logoutController } from "../../controllers/auth.controller";
import { listVaultController } from "../../controllers/vault.controller";
import { VaultItem, VaultType } from "../../models/entities/VaultItem";

export default function VaultListScreen({ navigation }: any) {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [filter, setFilter] = useState<VaultType | "all">("all");

  const load = async () => setItems(await listVaultController());
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((x) => x.type === filter);
  }, [items, filter]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Password Vault" />
        <Appbar.Action icon="refresh" onPress={load} />
        <Appbar.Action icon="logout" onPress={logoutController} />
      </Appbar.Header>

      <View style={{ padding: 12 }}>
        <SegmentedButtons
          value={filter}
          onValueChange={(v) => setFilter(v as any)}
          buttons={[
            { value: "all", label: "All" },
            { value: "social", label: "Social" },
            { value: "system", label: "System" },
            { value: "application", label: "App" },
            { value: "database", label: "DB" }
          ]}
        />
      </View>

      {filtered.map((item) => (
        <List.Item
          key={item._id}
          title={item.title}
          description={`${item.type}${item.username ? " • " + item.username : ""}`}
          left={(p) => <List.Icon {...p} icon="lock" />}
          onPress={() => navigation.navigate("VaultDetail", { item })}
        />
      ))}

      <FAB
        icon="plus"
        style={{ position: "absolute", right: 16, bottom: 16 }}
        onPress={() => navigation.navigate("VaultEdit")}
      />
    </View>
  );
}
