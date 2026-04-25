import { axiosInstance } from "@/lib/axios";

export const fetchSongById = async (songId: string) => {
  try {
    const response = await axiosInstance.get(`/songs/${songId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching song:",
      error?.response?.data?.message || error.message
    );
    throw error;
  }
};

export const getCharts = async () => {
  try {
    const response = await axiosInstance.get(`/songs/collection/charts`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching charts:",
      error?.response?.data?.message || error.message
    );
    throw error;
  }
};
