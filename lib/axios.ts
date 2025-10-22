import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
console.log("apiUrl: ", apiUrl);
const getAccessToken = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  return token ? token : null;
};

export const axiosInstance = axios.create({
  baseURL: apiUrl,
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
