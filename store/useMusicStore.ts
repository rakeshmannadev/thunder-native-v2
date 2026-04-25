import { axiosInstance } from "@/lib/axios";
import {
  Album,
  Artist,
  Chart,
  Featured,
  Playlist,
  SearchedSong,
  Show,
  Song,
  TopAlbums,
  TopArtists,
} from "@/types";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  featured: Featured[];
  madeForYouAlbums: Album[];
  currentAlbum: Album | null;
  currentArtist: Artist | null;
  trending: Song[];
  topAlbums: TopAlbums[];
  currentPlaylist: Playlist | null;

  searchedSongs: SearchedSong | null;
  single: Song | null;
  playlistLoading: boolean;
  _loadingCount: number;
  isLoading: boolean;
  isAlbumFetching: boolean;
  searchLoading: boolean;
  charts: Chart[];
  shows: Show[];
  topArtists: TopArtists[];

  fetchAllSongs: () => Promise<void>;
  fetchArtistById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouAlbums: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchAlbumById: (albumId: string) => Promise<void>;
  fetchCharts: () => Promise<void>;
  fetchShows: () => Promise<void>;
  searchSong: (query: string) => Promise<void>;
  fetchSingle: (id: string) => Promise<void>;
  setSearchedSongs: (songs: SearchedSong | null) => void;
  setChartData: (charts: Chart[]) => void;
  fetchTopArtists: () => Promise<void>;
  fetchTopAlbums: () => Promise<void>;
  getPlaylistSongs: (id: string) => Promise<void>;
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
  charts: [],
  shows: [],
  topArtists: [],
  topAlbums: [],
  playlistLoading: false,
  currentPlaylist: null,
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
      const response = await axiosInstance.get(
        "/songs/collection/featured-playlists?page=10"
      );

      if (response.status) {
        set({ featured: response.data.collection.data });
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
  fetchCharts: async () => {
    set(startLoading);
    try {
      const response = await axiosInstance.get(
        "/songs/collection/charts?page=10"
      );
      console.log("res: ", response);
      if (response.status) {
        set({ charts: response.data?.collection || [] });
      }
    } catch (error: any) {
      console.log("Error in fetching charts", error);
    } finally {
      set(stopLoading);
    }
  },
  fetchShows: async () => {
    set(startLoading);
    try {
      const response = await axiosInstance.get(
        "/songs/collection/top-shows?page=10"
      );
      if (response.status) {
        set({
          shows: response.data?.collection.data || [],
        });
      }
    } catch (error: any) {
      console.log("Error in fetching shows", error);
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
  setChartData(charts) {
    set({ charts });
  },
  fetchTopArtists: async () => {
    set(startLoading);
    try {
      const response = await axiosInstance.get(
        "/songs/collection/top-artists?page=10"
      );
      if (response.status) {
        set({ topArtists: response.data?.collection || [] });
      }
    } catch (error: any) {
      console.log(
        "Error in fetching top artists",
        error?.response?.data?.message
      );
      set({ topArtists: [] });
    } finally {
      set(stopLoading);
    }
  },
  fetchTopAlbums: async () => {
    set(startLoading);
    try {
      const response = await axiosInstance.get(
        "/songs/collection/top-albums?page=10"
      );
      if (response.status) {
        set({ topAlbums: response.data?.collection.data || [] });
      }
    } catch (error: any) {
      console.log(
        "Error in fetching top albums",
        error?.response?.data?.message
      );
      set({ topAlbums: [] });
    } finally {
      set(stopLoading);
    }
  },
  getPlaylistSongs: async (id) => {
    set({ playlistLoading: true });
    try {
      const response = await axiosInstance.get(`/playlists/${id}`);

      if (response.data.status) {
        set({ currentPlaylist: response.data.playlist.data });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      set({ playlistLoading: false });
    }
  },
}));
export default useMusicStore;
