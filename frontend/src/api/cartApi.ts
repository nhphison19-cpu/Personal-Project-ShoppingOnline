import { axiosClient } from "./axiosClient";
import { ApiResponse, Cart } from "../types";

export const cartApi = {
  getCart: async (): Promise<ApiResponse<Cart>> => {
    const res = await axiosClient.get("/cart/get");
    return res.data;
  },
  addToCart: async (productId: string, quantity: number): Promise<ApiResponse<Cart>> => {
    const res = await axiosClient.post("/cart/add", { productId, quantity });
    return res.data;
  },
  deleteCartItem: async (itemId: string): Promise<ApiResponse<Cart>> => {
    const res = await axiosClient.delete(`/cart/delete/${itemId}`);
    return res.data;
  },
  clearCart: async (): Promise<ApiResponse<Cart>> => {
    const res = await axiosClient.delete("/cart/clear");
    return res.data;
  }
};
export default cartApi;
