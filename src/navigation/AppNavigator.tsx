import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../views/screens/LoginScreen";
import RegisterScreen from "../views/screens/RegisterScreen";
import VaultListScreen from "../views/screens/VaultListScreen";
import VaultDetailScreen from "../views/screens/VaultDetailScreen";
import VaultEditScreen from "../views/screens/VaultEditScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  VaultList: undefined;
  VaultDetail: { item: any };
  VaultEdit: { item?: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator({
  isAuthed,
  setIsAuthed,
}: {
  isAuthed: boolean;
  setIsAuthed: (v: boolean) => void;
}) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthed ? (
        <>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setIsAuthed={setIsAuthed} />}
          </Stack.Screen>

          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="VaultList">
            {(props) => <VaultListScreen {...props} setIsAuthed={setIsAuthed} />}
          </Stack.Screen>

          <Stack.Screen name="VaultDetail" component={VaultDetailScreen} />
          <Stack.Screen name="VaultEdit" component={VaultEditScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}