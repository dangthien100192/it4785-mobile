import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AppNavigator from "./navigation/AppNavigator";
import { useAuthStore } from "./models/store/auth.store";
import { theme } from "./views/theme/theme";

export default function App() {
  const token = useAuthStore((s) => s.token);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppNavigator isAuthed={!!token} />
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}