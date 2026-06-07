import { axiosClient } from "./axiosClient";
import { ApiResponse, Product } from "../types";

export const productApi = {
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    const res = await axiosClient.get("/product/getall");
    return res.data;
  },
  getProductDetail: async (id: string): Promise<ApiResponse<Product>> => {
    const res = await axiosClient.get(`/product/getdetail/${id}`);
    return res.data;
  },
  createProduct: async (data: any): Promise<ApiResponse<Product>> => {
    const res = await axiosClient.post("/product/create", data);
    return res.data;
  },
  updateProduct: async (id: string, data: any): Promise<ApiResponse<Product>> => {
    const res = await axiosClient.put(`/product/update/${id}`, data);
    return res.data;
  },
  deleteProduct: async (id: string): Promise<ApiResponse<any>> => {
    const res = await axiosClient.delete(`/product/delete/${id}`);
    return res.data;
  }
};
export default productApi;
