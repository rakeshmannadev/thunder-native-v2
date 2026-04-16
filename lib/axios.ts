import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// In-memory token cache — avoids disk I/O on every API call
let cachedToken: string | null = null;

export const setCachedToken = (token: string | null) => {
  cachedToken = token;
};

export const clearCachedToken = () => {
  cachedToken = null;
};

// Only falls back to AsyncStorage if cache is empty (cold start)
const getAccessToken = async () => {
  if (cachedToken) return cachedToken;
  const token = await AsyncStorage.getItem("accessToken");
  if (token) cachedToken = token;
  return token;
};

export const axiosInstance = axios.create({
  baseURL: apiUrl,
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
