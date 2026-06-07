import { create } from "zustand";
import { CartItem } from "../types";

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  clearCart: () => set({ items: [] }),
}));
