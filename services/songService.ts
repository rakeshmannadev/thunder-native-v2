import { axiosInstance } from "@/lib/axios";

export const getAllSongs = async () => {
  try {
    const response = await axiosInstance.get("/songs");
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getFeaturedSongs = async () => {
  try {
    const response = await axiosInstance.get(
      "/songs/collection/featured-playlists?page=10"
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getArtistById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/artists/${id}`);
    return response.data?.artist;
  } catch (error: any) {
    throw error;
  }
};

export const getSongById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/songs/${id}`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getAlbumById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/albums/${id}`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getMadeForYouAlbums = async () => {
  try {
    const response = await axiosInstance.get("/albums");
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getTrendingSongs = async () => {
  try {
    const response = await axiosInstance.get("/songs/trending");
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getCharts = async () => {
  try {
    const response = await axiosInstance.get(
      "/songs/collection/charts?page=10"
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getShows = async () => {
  try {
    const response = await axiosInstance.get(
      "/songs/collection/top-shows?page=10"
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const searchSongQuery = async (query: string) => {
  try {
    const response = await axiosInstance.get(`/songs/searchSong/${query}`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getTopArtists = async () => {
  try {
    const response = await axiosInstance.get(
      "/songs/collection/top-artists?page=10"
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getTopAlbums = async () => {
  try {
    const response = await axiosInstance.get(
      "/songs/collection/top-albums?page=10"
    );
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getPlaylistById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/playlists/${id}`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

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
