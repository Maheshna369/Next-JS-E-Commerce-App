const CartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      // Check if the product already exists in the cart
      const existingProductIndexForAdd = state.Cart.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingProductIndexForAdd >= 0) {
        // Update quantity if product already exists in the cart
        const updatedCart = state.Cart.map((item, index) =>
          index === existingProductIndexForAdd
            ? { ...item, quantity: item.quantity + 1 } // Increment quantity
            : item
        );
        return { ...state, Cart: updatedCart };
      } else {
        // If product doesn't exist, add it to the cart with quantity 1
        return {
          ...state,
          Cart: [...state.Cart, { ...action.payload, quantity: 1 }],
        };
      }
    case "REMOVE_FROM_CART":
      const existingProductIndexForRemove = state.Cart.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingProductIndexForRemove >= 0) {
        // Remove the product from the cart
        const updatedCart = state.Cart.filter(
          (item) => item.id !== action.payload.id
        );
        return { ...state, Cart: updatedCart };
      } else {
        return state; // If product not found, return the state as is
      }
    case "INCREMENT_QUANTITY":
      // Increment product quantity
      const updatedCartForIncrement = state.Cart.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return { ...state, Cart: updatedCartForIncrement };

    case "DECREMENT_QUANTITY":
      // Decrement product quantity (if quantity > 1)
      const updatedCartForDecrement = state.Cart.map((item) =>
        item.id === action.payload.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return { ...state, Cart: updatedCartForDecrement };
    default:
      return state;
  }
};

export default CartReducer;
