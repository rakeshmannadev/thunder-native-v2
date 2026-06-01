import { axiosInstance } from "@/lib/axios";
import { Artist, Playlist, Room, Song } from "@/types";

export const getFavoriteSongs = async () => {
  try {
    const response = await axiosInstance.get("/user/getFavoriteSongs");
    return response.data.songs;
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};

export const getSavedAlbums = async () => {
  try {
    const response = await axiosInstance.get("/user/getPlaylists");
    return response.data.playlists;
  } catch (error: any) {
    console.log(error.response.data.messages);
  }
};

export const getJoinedRooms = async () => {
  try {
    const response = await axiosInstance.get("/user/getJoinedRooms");
    return response.data.rooms as Room[];
  } catch (error: any) {
    console.log(error.response.data.message);
    throw error;
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
  artists,
  songs,
}: {
  name: string;
  image?: string;
  artists: Artist[];
  songs: Song[];
}) => {
  try {
    const response = await axiosInstance.post("/user/createPlaylist", {
      playListName: name,
      imageUrl: image || "",
      artists,
      songs,
    });
    return response.data.playlist;
  } catch (error: any) {
    console.log(error.response.data.message);
    throw error;
  }
};

export const deletePlaylist = async (playlistId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/user/deletePlaylist/${playlistId}`
    );
    return response.data.status;
  } catch (error: any) {
    console.log(error.response.data.message);
    throw error;
  }
};

export const removeFromFavorites = async (songId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/user/removeFromFavorite/${songId}`
    );
    return response.data.status;
  } catch (error: any) {
    console.log(error.response.data.message);
    throw error;
  }
};

export const removeSongFromPlaylist = async (
  songId: string,
  playlistId: string
) => {
  try {
    const response = await axiosInstance.delete(
      `/user/deleteFromPlaylist/${playlistId}/${songId}`
    );
    return response.data.status;
  } catch (error: any) {
    console.log(error.response.data.message);
    throw error;
  }
};

export const getUserPlaylists = async () => {
  try {
    const response = await axiosInstance.get("/playlists/user-playlists");
    return response.data.playlists;
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};

export const saveRecentlyPlayed = async (song: Song) => {
  try {
    const response = await axiosInstance.post("/user/saveRecentlyPlayed", {
      song,
    });
    return response.data;
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};

export const getRecentlyPlayed = async () => {
  try {
    const response = await axiosInstance.get("/user/getRecentlyPlayed");
    return response.data.songs;
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};
