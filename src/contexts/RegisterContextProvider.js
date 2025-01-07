"use client";
import { createContext, useState } from "react";
export const RegisterContext = createContext();
export const RegisterProvider = ({children}) => {
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  return (
    <RegisterContext.Provider
      value={{ openRegisterModal, setOpenRegisterModal }}
    >
      {children}
    </RegisterContext.Provider>
  );
};
