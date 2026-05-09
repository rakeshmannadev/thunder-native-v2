import { axiosInstance } from "@/lib/axios";
import { Artist, Song } from "@/types";

export const getFavoriteSongs = async () => {
  try {
    const response = await axiosInstance.get("/user/getFavoriteSongs");
    return response.data.songs;
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};

export const getPlaylists = async () => {
  try {
    const response = await axiosInstance.get("/user/getPlaylists");
    return response.data.playlists;
  } catch (error: any) {
    console.log(error.response.data.messages);
  }
};

export const addToFavorites = async ({
  song,
  playListName = "Favorites",
  artists,
  imageUrl,
}: {
  song: Song;
  playListName?: string;
  artists: Artist[];
  imageUrl?: string;
}) => {
  try {
    const response = await axiosInstance.post("/user/addToFavorite", {
      song,
      playListName,
      artists,
      imageUrl,
    });
    return response.data;
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};

export const addSongToPlaylist = async ({
  playlistId,
  song,
  playListName,
  artists,
  imageUrl,
}: {
  song: Song;
  playlistId: string | null;
  playListName: string;
  artists: Artist[];
  imageUrl?: string;
}) => {
  try {
    const response = await axiosInstance.post("/user/addSongToPlaylist", {
      id: playlistId,
      song,
      playListName,
      artists,
      imageUrl,
    });
    return response.data.playlist;
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};
