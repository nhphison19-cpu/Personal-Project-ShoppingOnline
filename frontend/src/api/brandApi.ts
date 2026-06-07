import { axiosClient } from "./axiosClient";
import { ApiResponse, Brand } from "../types";

export const brandApi = {
  getAllBrands: async (): Promise<ApiResponse<Brand[]>> => {
    const res = await axiosClient.get("/brand/getall");
    return res.data;
  },
  getBrandDetail: async (id: string): Promise<ApiResponse<Brand>> => {
    const res = await axiosClient.get(`/brand/getdetail/${id}`);
    return res.data;
  },
  createBrand: async (data: any): Promise<ApiResponse<Brand>> => {
    const res = await axiosClient.post("/brand/create", data);
    return res.data;
  },
  updateBrand: async (id: string, data: any): Promise<ApiResponse<Brand>> => {
    const res = await axiosClient.put(`/brand/update/${id}`, data);
    return res.data;
  },
  deleteBrand: async (id: string): Promise<ApiResponse<any>> => {
    const res = await axiosClient.delete(`/brand/delete/${id}`);
    return res.data;
  }
};
export default brandApi;
