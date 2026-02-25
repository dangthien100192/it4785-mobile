import React from "react";

export const AuthContext = React.createContext<{
  isAuthed: boolean;
  setIsAuthed: (v: boolean) => void;
}>({
  isAuthed: false,
  setIsAuthed: () => {},
});