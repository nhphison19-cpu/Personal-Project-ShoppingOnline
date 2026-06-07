import { axiosClient } from "./axiosClient";
import { ApiResponse, Wishlist } from "../types";

export const wishlistApi = {
  getWishlist: async (): Promise<ApiResponse<Wishlist[]>> => {
    const res = await axiosClient.get("/wishlist/getWishList");
    return res.data;
  },
  addToWishlist: async (productId: string): Promise<ApiResponse<Wishlist[]>> => {
    const res = await axiosClient.post(`/wishlist/create/${productId}`);
    return res.data;
  },
  deleteFromWishlist: async (productIdOrWlId: string): Promise<ApiResponse<Wishlist[]>> => {
    const res = await axiosClient.delete(`/wishlist/delete/${productIdOrWlId}`);
    return res.data;
  }
};
export default wishlistApi;
