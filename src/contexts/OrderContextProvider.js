"use client";
import { createContext, useState } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderDetails, setOrderDetails] = useState({
    Name: "",
    Address: "",
    Email: "",
    PhoneNumber: "",
    SubTotal: "",
    Fees: "",
    Products: [],
    OrderType: "",
  });

  return (
    <OrderContext.Provider value={{ orderDetails, setOrderDetails }}>
      {children}
    </OrderContext.Provider>
  );
};
