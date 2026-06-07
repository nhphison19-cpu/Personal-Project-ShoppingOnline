import { axiosClient } from "./axiosClient";
import { ApiResponse, Review } from "../types";

export const reviewApi = {
  getProductReviews: async (productId: string): Promise<ApiResponse<Review[]>> => {
    const res = await axiosClient.get(`/review/getReview/${productId}`);
    return res.data;
  },
  createReview: async (productId: string, data: { rating: number; comment: string }): Promise<ApiResponse<Review>> => {
    const res = await axiosClient.post(`/review/create/${productId}`, data);
    return res.data;
  },
  updateReview: async (reviewId: string, data: { rating: number; comment: string }): Promise<ApiResponse<Review>> => {
    const res = await axiosClient.put(`/review/update/${reviewId}`, data);
    return res.data;
  },
  deleteReview: async (reviewId: string): Promise<ApiResponse<any>> => {
    const res = await axiosClient.delete(`/review/delete/${reviewId}`);
    return res.data;
  }
};
export default reviewApi;
