import { useState, createContext } from "react";

const CartContext = createContext({
    NBook: 0,
    Total: 0,
    Books: [],
  });

export default CartContext;