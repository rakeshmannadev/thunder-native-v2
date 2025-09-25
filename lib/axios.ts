import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const getAccessToken = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  return token ? token : null;
};

export const axiosInstance = axios.create({
  baseURL: "https://thunder-backend-rs1p.onrender.com/api/v1",
  // baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// Interceptor to add token dynamically before each request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers["accessToken"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
