import { axiosInstance } from "@/lib/axios";

export const signup = async (authData: object) => {
  const response = await axiosInstance.post("/auth/signup", {
    ...authData,
  });
  return response.data;
};
export const login = async (authData: object) => {
  const response = await axiosInstance.post("/auth/login", {
    ...authData,
  });
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/user/getCurrentUser");
  return response.data;
};
