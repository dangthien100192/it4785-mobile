import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  return (
    <NavigationContainer>
      <AppNavigator isAuthed={isAuthed} setIsAuthed={setIsAuthed} />
    </NavigationContainer>
  );
}