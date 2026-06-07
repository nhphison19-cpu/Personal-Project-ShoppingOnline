import { axiosClient } from "./axiosClient";
import { ApiResponse, Category } from "../types";

export const categoryApi = {
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    const res = await axiosClient.get("/category/getall");
    return res.data;
  },
  getCategoryDetail: async (id: string): Promise<ApiResponse<Category>> => {
    const res = await axiosClient.get(`/category/getCategory/${id}`);
    return res.data;
  },
  createCategory: async (data: any): Promise<ApiResponse<Category>> => {
    const res = await axiosClient.post("/category/create", data);
    return res.data;
  },
  updateCategory: async (id: string, data: any): Promise<ApiResponse<Category>> => {
    const res = await axiosClient.put(`/category/update/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id: string): Promise<ApiResponse<any>> => {
    const res = await axiosClient.delete(`/category/delete/${id}`);
    return res.data;
  }
};
export default categoryApi;
