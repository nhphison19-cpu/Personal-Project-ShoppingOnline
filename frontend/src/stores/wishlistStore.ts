import { create } from "zustand";
import { Wishlist } from "../types";

interface WishlistState {
  items: Wishlist[];
  setItems: (items: Wishlist[]) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  clearWishlist: () => set({ items: [] }),
}));
