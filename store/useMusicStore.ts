import { axiosInstance } from "@/lib/axios";
import { Album, Artist, SearchedSong, Song } from "@/types";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  featured: Song[];
  madeForYouAlbums: Album[];
  currentAlbum: Album | null;
  currentArtist: Artist | null;
  trending: Song[];
  searchedSongs: SearchedSong | null;
  single: Song | null;
  // Loading counter — isLoading is true when any fetch is in-flight
  _loadingCount: number;
  isLoading: boolean;
  isAlbumFetching: boolean;
  searchLoading: boolean;
  fetchAllSongs: () => Promise<void>;
  fetchArtistById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouAlbums: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchAlbumById: (albumId: string) => Promise<void>;
  searchSong: (query: string) => Promise<void>;
  fetchSingle: (id: string) => Promise<void>;
  setSearchedSongs: (songs: SearchedSong | null) => void;
}

// Helpers to increment/decrement the loading counter
const startLoading = (state: MusicStore) => ({
  _loadingCount: state._loadingCount + 1,
  isLoading: true,
});
const stopLoading = (state: MusicStore) => {
  const next = state._loadingCount - 1;
  return { _loadingCount: next, isLoading: next > 0 };
};

const useMusicStore = create<MusicStore>((set) => ({
  songs: [],
  single: null,
  featured: [],
  madeForYouAlbums: [],
  trending: [],
  currentAlbum: null,
  currentArtist: null,
  searchedSongs: null,
  _loadingCount: 0,
  isLoading: false,
  searchLoading: false,
  isAlbumFetching: false,

  fetchAllSongs: async () => {
    set(startLoading);
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data.songs });
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    } finally {
      set(stopLoading);
    }
  },
  fetchFeaturedSongs: async () => {
    set(startLoading);
    try {
      const response = await axiosInstance.get("/songs/featured");
      if (response.status) {
        set({ featured: response.data.songs });
      }
    } catch (error: any) {
      console.log(
        "Error in fetching featured songs",
        error?.response?.data?.message
      );
    } finally {
      set(stopLoading);
    }
  },
  fetchArtistById: async (id: string) => {
    set(startLoading);
    try {
      const response = await axiosInstance.get(`/artists/${id}`);
      set({ currentArtist: response.data.artist });
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      set({ currentArtist: null });
    } finally {
      set(stopLoading);
    }
  },
  fetchSingle: async (id) => {
    set(startLoading);
    try {
      const response = await axiosInstance.get(`/songs/${id}`);
      if (response.data) {
        // Fetch album and artist in parallel instead of sequentially (#7)
        const [albumResponse, artistResponse] = await Promise.all([
          axiosInstance.get(`/albums/${response.data.song.albumId}`),
          axiosInstance.get(`/artists/${response.data.song.artistId}`),
        ]);
        if (albumResponse.status) {
          set({ currentAlbum: albumResponse.data.album });
        }
        if (artistResponse) {
          set({ currentArtist: artistResponse.data.artist });
        }
        set({ single: response.data.song });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      set({ single: null, currentAlbum: null });
    } finally {
      set(stopLoading);
    }
  },
  fetchMadeForYouAlbums: async () => {
    set(startLoading);
    try {
      const response = await axiosInstance.get("/albums");
      if (response.status) {
        set({ madeForYouAlbums: response.data.albums });
      }
    } catch (error: any) {
      console.log("Error in fetching albums", error?.response?.data?.message);
    } finally {
      set(stopLoading);
    }
  },
  fetchTrendingSongs: async () => {
    set(startLoading);
    try {
      const response = await axiosInstance.get("/songs/trending");
      if (response.status) {
        set({ trending: response.data?.songs });
      }
    } catch (error: any) {
      console.log("Error in fetching trending songs", error);
    } finally {
      set(stopLoading);
    }
  },
  fetchAlbumById: async (albumId) => {
    set({ isAlbumFetching: true });
    try {
      const response = await axiosInstance.get(`/albums/${albumId}`);
      if (response.status) {
        set({ currentAlbum: response.data.album });
      }
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    } finally {
      set({ isAlbumFetching: false });
    }
  },
  searchSong: async (query) => {
    set({ searchLoading: true });
    try {
      const response = await axiosInstance.get(`/songs/searchSong/${query}`);
      if (response.data.status) {
        set({ searchedSongs: response.data.song });
      }
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    } finally {
      set({ searchLoading: false });
    }
  },
  setSearchedSongs(songs) {
    set({ searchedSongs: songs });
  },
}));
export default useMusicStore;
