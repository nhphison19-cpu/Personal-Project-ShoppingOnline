import { axiosClient } from "./axiosClient";
import { ApiResponse, Address } from "../types";

export const addressApi = {
  getAllAddresses: async (): Promise<ApiResponse<Address[]>> => {
    const res = await axiosClient.get("/information/getall");
    return res.data;
  },
  getAddressById: async (id: string): Promise<ApiResponse<Address>> => {
    const res = await axiosClient.get(`/information/getById/${id}`);
    return res.data;
  },
  createAddress: async (data: any): Promise<ApiResponse<Address>> => {
    const res = await axiosClient.post("/information/create", data);
    return res.data;
  },
  updateAddress: async (id: string, data: any): Promise<ApiResponse<Address>> => {
    const res = await axiosClient.put(`/information/update/${id}`, data);
    return res.data;
  },
  deleteAddress: async (id: string): Promise<ApiResponse<any>> => {
    const res = await axiosClient.delete(`/information/delete/${id}`);
    return res.data;
  }
};
export default addressApi;
