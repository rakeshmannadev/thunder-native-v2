export interface Song {
  id: string;
  name: string;
  subtitle: string;
  artist_map: {
    primary_artists: Artist[];
  };
  album: string;
  album_id: string;
  duration: number;
  image: Image[];
  download_url: Image[];
  release_date: string;
}

export interface Artist {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  image: any;
  top_songs: Song[];
  top_albums: Album[];
  dedicated_artist_playlist: any[];
  featured_artist_playlist: any[];
  singles: Album[];
  latest_release: Album[];
  all_songs: Song[];
  similar_artists: Artist[];
  bio: { text: string }[];
  dob: string;
  fb: string;
  twitter: string;
  wiki: string;
  fan_count: number;
}
export interface Album {
  id: string;
  name: string;
  subtitle: string;
  image: Image[];
  duration: number;
  year: number;
  artist_map: {
    primary_artists: Artist[];
  };
  songs: Song[];
}
export interface SearchedSong {
  albums: {
    data: AlbumResult[];
  };
  artists: {
    data: ArtistResult[];
  };
  playlists: {
    data: PlaylistResult[];
  };
  top_query: {
    data: TopResult[];
  };
  songs: {
    data: SongRequest[];
  };
}

export interface TopResult {
  id: string;
  name: string;
  image: Image[];
  type: string;
  primary_artists?: string;
  subtitle?: string;
  album?: string;
}

export interface SongResult {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: Image[];
  album: string;
  primary_artists: string;
  singers: string;
}
export interface AlbumResult {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  image: Image[];
  year: number;
}
export interface PlaylistResult {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  image: Image[];
}
export interface ArtistResult {
  id: string;
  name: string;
  subtitle: string;
  image: string;
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
  id: string;
  name: string;
  playlistName?: string;
  subtitle?: string;
  type?: string;
  image?: string;
  imageUrl?: string;
  language?: string;
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
  songs: Song[];
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

export type qualites = "low" | "medium" | "high";

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
