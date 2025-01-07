"use client";
import { createContext, useEffect, useReducer } from "react";
import CartReducer from "@/reducer/CartReducer";

export const CartContext = createContext();

const getCart = () => {
  if (typeof window !== "undefined") {
    // Ensure localStorage is only used in the client-side (browser)
    const cartData = localStorage.getItem("MaphyCart");
    if (cartData) {
      return JSON.parse(cartData);
    } else {
      return [];
    }
  }
  return []; // Return empty array on SSR
};

const initialState = {
  Cart: getCart(), // Initialize Cart from localStorage
  total_items: 0,
  total_amount: 0,
  shippingFee: 29,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };
  const removeFromCart = (product) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: product });
  };
  const increaseQuantity = (productId) => {
    dispatch({ type: "INCREMENT_QUANTITY", payload: { id: productId } });
  };

  // Handle the decrease in quantity
  const decreaseQuantity = (productId) => {
    dispatch({ type: "DECREMENT_QUANTITY", payload: { id: productId } });
  };

  useEffect(() => {
    localStorage.setItem("MaphyCart", JSON.stringify(state.Cart));
  }, [state.Cart]);

  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
