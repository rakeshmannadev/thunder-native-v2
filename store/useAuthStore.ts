import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "./useUserStore";

interface AuthStore {
  signup: (authData: object) => Promise<void>;
  login: (authData: object) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const useAuthStore = create<AuthStore>((set) => ({
  isLoading: false,
  signup: async (authData) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post("/auth/signup", {
        ...authData,
      });
      if (response.data.status) {
        useUserStore.setState({ currentUser: response.data.user });
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        await AsyncStorage.setItem("accessToken", response.data.accessToken);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      //   toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (authData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/auth/login", { ...authData });
      if (response.data.status) {
        useUserStore.setState({ currentUser: response.data.user });
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        await AsyncStorage.setItem("accessToken", response.data.accessToken);
        // toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      //   toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      if (response.data.status) {
        useUserStore.setState({ currentUser: null });
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("accessToken");
        // toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      //   toast.error(error.response.data.message);
    }
  },
}));

export default useAuthStore;
