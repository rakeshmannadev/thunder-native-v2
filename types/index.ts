export interface Song {
  _id: string;
  id?: string;
  songId: string;
  title: string;
  artists: {
    primary: Artist[];
  };
  artistId: string;
  imageUrl: string;
  audioUrl: string;
  releaseYear: string;
  duration: number;
  albumId: string;
}

export interface Artist {
  _id: string;
  name: string;
  artistId: string;
  role: string;
  followers: number;
  fanCount: number;
  isVerified: boolean;
  type: string;
  bio: [];
  dob: string;
  fb: string;
  twitter: string;
  instagram: string;
  wiki: string;
  image: string;
  topSongs: Song[];
  albums: Album[];
  singles: Album[];
  id?: string;

  url?: string;

  images?: Image[];
}
export interface Album {
  _id: string;
  albumId: string;
  title: string;
  imageUrl: string;
  artists: {
    primary: [
      {
        id: string;
        name: string;
      },
    ];
    all: any[];
    featured: any[];
  };
  releaseYear: string;
  songs: Song[];
}
export interface SearchedSong {
  albums: {
    results: [
      {
        id: string;
        title: string;
        image: [{ quality: string; url: string }];
        artist: string;
      },
    ];
  };
  artists: {
    results: [
      {
        id: string;
        title: string;
        image: [{ quality: string; url: string }];
        type: string;
        description: string;
      },
    ];
  };
  playlists: {
    results: [
      {
        id: string;
        title: string;
        type: string;
        image: [{ quality: string; url: string }];
      },
    ];
  };
  songs: {
    results: [
      {
        id: string;
        title: string;
        singers: string;
        image: [{ quality: string; url: string }];
      },
    ];
  };
  topQuery: {
    results: [
      {
        id: string;
        title: string;
        image: [{ quality: string; url: string }];
        type: string;
      },
    ];
  };
}

export interface TopResult {
  id: string;
  title: string;
  image: [{ quality: string; url: string }];
  type: string;
}

export interface SongResult {
  id: string;
  title: string;
  singers: string;
  image: [{ quality: string; url: string }];
}
export interface AlbumResult {
  id: string;
  title: string;
  image: [{ quality: string; url: string }];
  artist: string;
}
export interface PlaylistResult {
  id: string;
  title: string;
  type: string;
  image: [{ quality: string; url: string }];
}
export interface ArtistResult {
  id: string;
  title: string;
  image: [{ quality: string; url: string }];
  type: string;
  description: string;
}
export interface Room {
  _id: string;
  roomId: string;
  visability: string;
  roomName: string;
  image: string;
  admin: string;
  modarators: any[];
  requests: Requests[];
  participants: string[];
  messages: Message[];
}
export interface Message {
  _id: string;
  senderId: User;
  message: string;
}

export interface Playlist {
  _id: string;
  id?: string;
  name?: string;
  subtitle?: string;
  type?: string;
  headerDesc?: string;
  url?: string;
  image?: string;
  language?: string;
  explicit?: boolean;
  listCount?: number;
  listType?: string;
  userId?: string;
  isDolbyContent?: boolean;
  lastUpdated?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  followerCount?: number;
  fanCount?: number;
  share?: number;
  videoCount?: number;
  artists?: Artist[];
  songs?: PlaylistSongs[] | any;
}

export interface PlaylistSongs {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  url: string;
  image: Image[];
  language: string;
  year: number;
  headerDesc: string;
  playCount: number;
  explicit: boolean;
  list: string;
  listType: string;
  listCount: number;
  music: string;
  artist_map: {
    artists: Artist[];
    featuredArtists: any[];
    primaryArtists: PrimaryArtist[];
    image: Image[];
  };
  album: string;
  album_id: string;
  albumUrl: string;
  label: string;
  labelUrl: string;
  origin: string;
  isDolbyContent: boolean;
  "320kbps": boolean;
  download_url: {
    quality: string;
    link: string;
  }[];
  duration: number;
  hasLyrics: boolean;
  lyricsSnippet: string;
  starred: boolean;
  releaseDate: string;
  trillerAvailable: boolean;
  copyrightText: string;
  vcode?: string;
  vlink?: string;
  lyricsId?: string;
}
export interface User {
  _id: string;
  email: string;
  gender: string;
  name: string;
  image: string;
  rooms: Array<Room>;
  role: string;
  playlists: Array<Playlist>;
  followers: Array<any>;
  following: Array<any>;
}

export interface Requests {
  user: {
    userId: string;
    userName: string;
  };
  status: string;
  room: Room;
}
export interface SongRequest {
  _id: string;
  title: string;
  albumId: string;
  imageUrl: string;
  userName: string;
  userId: string;
}

export interface AudioPreferenceType {
  downloadFirst: boolean;
  quality: qualites;
}

export enum qualites {
  low = "low",
  medium = "medium",
  high = "high",
}

export interface Chart {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  url: string;
  explicit: boolean;
  image: string;
  firstName: string;
  count: number;
}

export interface Show {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  image: Image[];
  bannerImage: string;
  url: string;
  explicit: boolean;
  badge: string;
  releaseDate: string;
  seasonNumber: number;
}

interface Image {
  quality: string;
  link: string;
}

export interface Featured {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  headerDesc: string;
  url: string;
  image: string;
  explicit: boolean;
  userId: string;
  lastUpdated: string;
  firstname: string;
  followerCount: number;
}

export interface TopArtists {
  id: string;
  name: string;
  image: Image[];
  url: string;
  isFollowed: boolean;
  followerCount: number;
}

export interface TopAlbums {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  url: string;
  image: Image[];
  language: string;
  year: number;
  headerDesc: string;
  playCount: number;
  explicit: boolean;
  list: string;
  listType: string;
  listCount: number;
  music: string;
  artist_map: ArtistMap;
  album: string;
  albumUrl: string;
  album_id: string;
  label: string;
  labelUrl: string;
  origin: string;
  isDolbyContent: boolean;
  "320kbps": boolean;
  download_url: Image[];
  duration: number;
  hasLyrics: boolean;
  lyricsSnippet: string;
  starred: boolean;
  releaseDate: string;
  trillerAvailable: boolean;
  copyrightText: string;
}

interface ArtistMap {
  artists: Artist[];
  featuredArtists: any[];
  primaryArtists: PrimaryArtist[];
}
interface PrimaryArtist {
  id: string;
  name: string;
  url: string;
  role: string;
  type: string;
  image: Image[];
}
