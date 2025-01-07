"use client";
import { createContext, useState } from "react";
export const LoginContext = createContext();
export const LoginProvider = ({children}) => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  return (
    <LoginContext.Provider value={{ openLoginModal, setOpenLoginModal }}>
      {children}
    </LoginContext.Provider>
  );
};
