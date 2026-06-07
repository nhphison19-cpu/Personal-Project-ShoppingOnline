import { axiosClient } from "./axiosClient";
import { ApiResponse, Order } from "../types";

export const orderApi = {
  createOrder: async (data: { paymentMethod: string; shippingAddress: string; items: { productId: string; quantity: number }[] }): Promise<ApiResponse<Order>> => {
    const res = await axiosClient.post("/order/create", data);
    return res.data;
  },
  createOrderFromCart: async (data: { paymentMethod: string; shippingAddress: string }): Promise<ApiResponse<Order>> => {
    const res = await axiosClient.post("/order/createOrderFromCart", data);
    return res.data;
  },
  getMyOrders: async (): Promise<ApiResponse<Order[]>> => {
    const res = await axiosClient.get("/order/getMyOrder");
    return res.data;
  },
  getOrderById: async (orderId: string): Promise<ApiResponse<Order>> => {
    const res = await axiosClient.get(`/order/getOrderById/${orderId}`);
    return res.data;
  },
  cancelOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    const res = await axiosClient.post(`/order/cancleOrder/${orderId}`);
    return res.data;
  },
  getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
    const res = await axiosClient.get("/order/getAll");
    return res.data;
  },
  updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
    const res = await axiosClient.put(`/order/update/${orderId}`, { status });
    return res.data;
  }
};
export default orderApi;
