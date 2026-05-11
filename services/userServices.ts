import { axiosInstance } from "@/lib/axios";
import { Artist, Playlist, Song } from "@/types";

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
  id,
  song,
  playListName,
  artists,
  imageUrl,
}: {
  song: Song;
  id: string | null;
  playListName: string;
  artists: Artist[];
  imageUrl?: string;
}) => {
  try {
    const response = await axiosInstance.post("/user/addSongToPlaylist", {
      id,
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

export const savePlaylistToLibrary = async (playlist: Playlist) => {
  try {
    const response = await axiosInstance.post("/user/addAlbumToPlaylist", {
      playListName: playlist.name,
      artists: [],
      albumId: null,
      id: playlist.id,
      imageUrl: playlist.image,
      songs: [],
    });
    return response.data.playlist;
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};
export const createPlaylist = async ({
  name,
  image,
}: {
  name: string;
  image?: string;
}) => {
  try {
    const response = await axiosInstance.post("/user/createPlaylist", {
      playListName: name,
      imageUrl: image || "",
    });
    return response.data.playlist;
  } catch (error: any) {
    console.log(error.response.data.message);
    throw error;
  }
};
