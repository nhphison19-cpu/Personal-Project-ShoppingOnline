import { axiosClient } from "./axiosClient";
import { ApiResponse, User } from "../types";

export const userApi = {
  signUp: async (data: any): Promise<ApiResponse<User>> => {
    const res = await axiosClient.post("/user/sign-up", data);
    return res.data;
  },
  signIn: async (data: any): Promise<ApiResponse<User>> => {
    const res = await axiosClient.post("/user/sign-in", data);
    return res.data;
  },
  updateUser: async (id: string, data: any): Promise<ApiResponse<User>> => {
    const res = await axiosClient.put(`/user/update-user/${id}`, data);
    return res.data;
  },
  getUserDetail: async (id: string): Promise<ApiResponse<User>> => {
    const res = await axiosClient.get(`/user/get-detail-user/${id}`);
    return res.data;
  },
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const res = await axiosClient.get("/user/getall");
    return res.data;
  },
  deleteUser: async (id: string): Promise<ApiResponse<any>> => {
    const res = await axiosClient.delete(`/user/delete/${id}`);
    return res.data;
  }
};
export default userApi;
