import { axiosInstance } from "@/lib/axios";

export const getAllSongs = async () => {
  try {
    const response = await axiosInstance.get("/songs");
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getFeaturedSongs = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  const options = {
    method: "GET",
    url: "/songs/featured",
    params: {
      page,
      limit,
    },
  };
  try {
    const response = await axiosInstance.request(options);
    if (response.status !== 200) {
      throw new Error("Failed to fetch featured songs");
    }
    return response.data.songs;
  } catch (error: any) {
    throw error;
  }
};

export const getArtistById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/artists/${id}`);
    return response;
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

export const getTrendingSongs = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  const options = {
    method: "GET",
    url: "/songs/trending",
    params: {
      page,
      limit,
    },
  };
  try {
    const response = await axiosInstance.request(options);
    if (response.status !== 200) {
      throw new Error("Failed to fetch trending songs");
    }
    return response.data.songs;
  } catch (error: any) {
    throw error;
  }
};

export const getCharts = async ({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) => {
  const options = {
    method: "GET",
    url: "/songs/top-charts",
    params: {
      page,
      limit,
    },
  };
  try {
    const response = await axiosInstance.request(options);
    if (response.status !== 200) {
      throw new Error("Failed to fetch charts");
    }
    return response.data.charts;
  } catch (error: any) {
    throw error;
  }
};

export const getShows = async ({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) => {
  const options = {
    method: "GET",
    url: "/songs/top-shows",
    params: {
      page,
      limit,
    },
  };
  try {
    const response = await axiosInstance.request(options);
    if (response.status !== 200) {
      throw new Error("Failed to fetch shows");
    }
    return response.data.shows;
  } catch (error: any) {
    throw error;
  }
};

export const searchSongQuery = async (query: string) => {
  try {
    const response = await axiosInstance.get(`/songs/search?query=${query}`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getTopArtists = async ({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) => {
  const options = {
    method: "GET",
    url: "/songs/top-artists",
    params: {
      page,
      limit,
    },
  };
  try {
    const response = await axiosInstance.request(options);
    if (response.status !== 200) {
      throw new Error("Failed to fetch top artists");
    }
    return response.data.artists;
  } catch (error: any) {
    throw error;
  }
};

export const getTopAlbums = async ({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) => {
  const options = {
    method: "GET",
    url: "/songs/popular-albums",
    params: {
      page,
      limit,
    },
  };
  try {
    const response = await axiosInstance.request(options);
    if (response.status !== 200) {
      throw new Error("Failed to fetch top albums");
    }
    return response.data.albums;
  } catch (error: any) {
    throw error;
  }
};

export const getPlaylistById = async ({
  id,
  link,
}: {
  id: string;
  link: string;
}) => {
  const options = {
    method: "GET",
    url: `/playlists/`,
    params: {
      id,
      link,
    },
  };
  try {
    const response = await axiosInstance.request(options);

    if (response.status !== 200) {
      throw new Error("Failed to fetch playlist");
    }
    return response.data.playlist;
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
