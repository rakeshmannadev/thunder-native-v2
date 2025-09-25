import { axiosInstance } from "@/lib/axios";
import { Playlist, Room, Song, User } from "@/types";

import { create } from "zustand";

interface UserStore {
  fetchJoinedRooms: () => Promise<void>;
  fetchPublicRooms: () => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  addToFavorite: (
    artist: Array<any>,
    imageUrl: string,
    audioUrl: string,
    albumId: string,
    artistId: string,
    duration: number,
    releaseYear: string,
    songId: string,
    id: string,
    title: string,
    playlistName: string
  ) => Promise<void>;
  getPlaylistSongs: (id: string) => Promise<void>;
  addSongToPlaylist: (
    playlistId: string | any,
    songId: string,
    playListName: string,
    artist: Array<any>,
    imageUrl: string
  ) => Promise<void>;
  getFavoriteSongs: () => Promise<void>;
  addAlbumToPlaylist: (
    playlistId: string | null,
    playListName: string,
    artist: Array<any>,
    albumId: string | any,
    imageUrl: string,
    songs: Array<string>
  ) => Promise<void>;
  rooms: Room[];
  publicRooms: Room[];
  currentUser: User | null;
  playlists: Playlist[];
  favoriteSongs: Song[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;
  playlistLoading: boolean;
  fetchingPlaylist: boolean;
}

const useUserStore = create<UserStore>((set, get) => ({
  isLoading: false,
  playlistLoading: false,
  fetchingPlaylist: false,
  rooms: [],
  publicRooms: [],
  playlists: [],
  favoriteSongs: [],
  currentPlaylist: null,
  currentUser: null,
  fetchJoinedRooms: async () => {
    try {
      const response = await axiosInstance.get("/user/getJoinedRooms");
      set({ rooms: response.data.rooms });
    } catch (error: any) {
      console.log(error.response.data.messages);
      console.log(error);
    } finally {
    }
  },
  fetchPublicRooms: async () => {
    try {
      const response = await axiosInstance.get("/user/getRooms");
      set({ publicRooms: response.data.rooms });
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
    }
  },
  fetchPlaylists: async () => {
    set({ fetchingPlaylist: true });

    try {
      const response = await axiosInstance.get("/user/getPlaylists");
      set({ playlists: response.data.playlists });
    } catch (error: any) {
      console.log(error.response.data.messages);
    } finally {
      set({ fetchingPlaylist: false });
    }
  },
  getFavoriteSongs: async () => {
    try {
      set({ playlistLoading: true });
      const response = await axiosInstance.get("/user/getFavoriteSongs");
      set({ favoriteSongs: response.data.songs[0].songs });
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      set({ playlistLoading: false });
    }
  },
  getCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/user/getCurrentUser");
      set({ currentUser: response.data.user });
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  addToFavorite: async (
    artist: Array<any>,
    imageUrl: string,
    audioUrl: string,
    albumId: string,
    artistId: string,
    duration: number,
    releaseYear: string,
    songId: string,
    id: string,
    title: string,
    playListName: string
  ) => {
    if (!get().currentUser) return;
    try {
      const response = await axiosInstance.post("/user/addToFavorite", {
        artist,
        imageUrl,
        songId,
        playListName,
      });

      if (response.data.status) {
        const newSong: Song = {
          _id: songId,
          songId: id,
          imageUrl,
          audioUrl,
          title,
          albumId,
          artistId,
          artists: { primary: artist },
          duration,
          releaseYear,
        };
        set({
          favoriteSongs: [...get().favoriteSongs, newSong],
        });

        // toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      //   toast.error(error.response.data.message);
    }
  },
  getPlaylistSongs: async (id) => {
    set({ playlistLoading: true });
    try {
      const response = await axiosInstance.get(`/user/getPlaylistSongs/${id}`);

      if (response.data.status) {
        set({ currentPlaylist: response.data.songs });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      set({ playlistLoading: false });
    }
  },
  addSongToPlaylist: async (
    playlistId,
    songId,
    playListName,
    artist,
    imageUrl
  ) => {
    try {
      const response = await axiosInstance.post("/user/addToPlaylist", {
        playlistId,
        songId,
        playListName,
        artist,
        imageUrl,
      });

      if (response.data.status) {
        if (playlistId) {
          set((state) => ({
            playlists: state.playlists.map((playlist) =>
              playlist._id === playlistId
                ? { ...playlist, songs: [...playlist.songs, songId] }
                : playlist
            ),
          }));
        } else {
          set((state) => ({
            playlists: [...state.playlists, response.data.playlist],
          }));
        }
        // toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      //   toast.error(error.response.data.message);
    }
  },
  addAlbumToPlaylist: async (
    playlistId,
    playListName,
    artist,
    albumId,
    imageUrl,
    songs
  ) => {
    try {
      const response = await axiosInstance.post("/user/addAlbumToPlaylist", {
        playListName,
        artist,
        albumId,
        playlistId,
        imageUrl,
        songs,
      });

      if (response.data.status) {
        set((state) => ({
          playlists: [...state.playlists, response.data.playlist],
        }));
        // toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  },
}));

export default useUserStore;
