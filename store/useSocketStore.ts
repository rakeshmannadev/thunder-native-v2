import { showToast } from "@/hooks/useToastMessage";
import {
  playAlbum as playTrackPlayerAlbum,
  playSong as playTrackPlayerSong,
} from "@/hooks/useTrackPlayerActions";
import { fetchSongById } from "@/services/songService";
import { Room, Song, SongRequest, User } from "@/types";
import TrackPlayer from "react-native-track-player";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import useRoomStore from "./useRoomStore";
import useUserStore from "./useUserStore";

interface SocketState {
  socket: Socket | null;
  isLoading: boolean;
  isJoined: boolean;
  isBroadcasting: boolean;
  isPlayingSong: boolean;
  activeUsers: string[];
  currentStreamingQueue: Song[];
  songRequests: SongRequest[];
  requestedUser: User | null;
  currentJockey: User | null;
  roomId: string;
  currentTime: number;
  currentRoom: Room | null;

  connectSocket: (userId: string) => void;
  startBroadcast: (userId: string, roomId: string) => void;
  playSong: (
    userId: string,
    roomId: string,
    songId: string,
    requestedUserId: string | null,
    time: number,
    currentJockey: User | null
  ) => void;
  pauseSong: (userId: string, roomId: string, time: number) => void;
  playAlbum: (
    roomId: string,
    songs: Song[],
    currentJockey: User | null
  ) => void;

  seekSong: (userId: string, roomId: string, time: number) => void;
  endBroadcast: (userId: string, roomId: string) => void;
  joinRoom: (userId: string, roomId: string) => void;
  leaveRoom: (userId: string, roomId: string) => void;
  sendJoinRequest: (userId: string, roomId: string) => void;
  sendSongRequest: (userId: string, roomId: string, song: SongRequest) => void;
  acceptJoinRequest: (userId: string, roomId: string) => void;
  rejectJoinRequest: (userId: string, roomId: string) => void;
  kickMember: (userId: string, roomId: string, memberId: string) => void;
  deleteRoom: (userId: string, roomId: string, room_id: string) => void;
  sendMessage: (content: string, senderId: string, roomId: string) => void;
  adminDeleteMessage: (
    roomId: string,
    messageId: string,
    adminId: string
  ) => void;
  deleteForEveryone: (
    roomId: string,
    messageId: string,
    senderId: string
  ) => void;
  editMessage: (
    roomId: string,
    messageId: string,
    senderId: string,
    content: string
  ) => void;
  disconnectSocket: () => void;
}

const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL;

const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  currentRoom: null,
  isLoading: false,
  isJoined: false,
  isBroadcasting: false,
  isPlayingSong: false,
  activeUsers: [],
  currentStreamingQueue: [],
  songRequests: [],
  currentJockey: null,
  requestedUser: null,
  userId: "",
  roomId: "",
  currentTime: 0,
  connectSocket: (userId) => {
    // Clean up existing socket to prevent listener stacking on reconnect
    const existingSocket = get().socket;
    if (existingSocket) {
      existingSocket.removeAllListeners();
      existingSocket.disconnect();
    }

    const socket = io(socketUrl!, {
      query: {
        userId,
      },
      transports: ["websocket"],
      forceNew: true,
      reconnectionAttempts: 5,
    });
    set({ socket });
    console.log("socket connected");

    socket.on("joinRequest", (data) => {
      useRoomStore.setState({
        joinRequests: [...useRoomStore.getState().joinRequests, data.request],
      });
      showToast("New join request received for " + data.request.room.roomName);
    });

    socket.on("joinRequestStatus", (data) => {
      if (data.status) {
        useUserStore.setState((state) => ({
          publicRooms: state.publicRooms.map((room) =>
            room._id === data.room._id
              ? { ...room, requests: [...room.requests, ...data.room.requests] }
              : room
          ),
        }));
      }
    });

    socket.on("joinRequestRejected", (data) => {
      if (data.userId !== useUserStore.getState().currentUser?._id) {
        useUserStore.setState((state) => ({
          publicRooms: state.publicRooms.map((room) =>
            room._id === data.room._id
              ? {
                  ...room,
                  requests: room.requests.filter(
                    (request) => request.user.userId !== data.memberId
                  ),
                }
              : room
          ),
        }));
      }
      useRoomStore.setState((state) => ({
        joinRequests: state.joinRequests.filter(
          (request) =>
            request.room._id !== data.room._id &&
            request.user.userId !== data.room.requests.user.userId
        ),
      }));
    });

    socket.on("joinRequestAccepted", (data) => {
      if (data.userId !== useUserStore.getState().currentUser?._id) {
        useUserStore.setState({
          rooms: [...useUserStore.getState().rooms, data.room],
        });
        useUserStore.setState((state) => ({
          publicRooms: state.publicRooms.filter(
            (room) => room._id !== data.room._id
          ),
        }));
      } else {
        useRoomStore.setState((state) => ({
          joinRequests: state.joinRequests.filter((request) => {
            return (
              request.room._id !== data.room._id &&
              request.user.userId !== data.room.requests.user.userId
            );
          }),
        }));
      }
    });

    socket.on("adminJoins", (data) => {
      console.log("admin joins");
      showToast(data.message);
      set({ roomId: data.roomId, isJoined: true, currentRoom: data.room });
    });

    socket.on("userJoins", (data) => {
      console.log("user joins");
      showToast(data.message);
      set({ roomId: data.roomId, isJoined: true, currentRoom: data.room });
      socket.emit("sync-request", { roomId: data.roomId });
    });

    socket.on("updateUsers", (data) => {
      set({ activeUsers: data.users });
    });

    socket.on(
      "broadcastStarted",
      ({ user, roomId }: { user: User; roomId: string }) => {
        showToast(`${user.name} has started the broadcast.`);
        set({
          isBroadcasting: true,
          currentJockey: user,
          roomId,
        });
      }
    );

    socket.on("music-control", async (data) => {
      const { action, songId, currentJockey, requestedUser, time, roomId } =
        data;
      console.log("action:", action);
      switch (action) {
        case "play":
          try {
            set({ isLoading: true });
            const songData = await fetchSongById(songId);
            if (songData.status) {
              const song = songData.song;
              await playTrackPlayerSong(song);
              if (time > 0) {
                await TrackPlayer.seekTo(time);
              }
              set({
                isPlayingSong: true,
                isBroadcasting: true,
                currentJockey,
                requestedUser,
                roomId,
              });
            }
          } catch (error) {
            console.error("Failed to fetch song from sound control:", error);
          } finally {
            set({ isLoading: false });
          }
          break;
        case "pause": {
          await TrackPlayer.pause();
          set({ isPlayingSong: false });

          break;
        }
        case "seek": {
          await TrackPlayer.seekTo(time);
          await TrackPlayer.play();
          break;
        }
        case "play-album": {
          const { songs, roomId, currentJockey } = data;
          set({
            isPlayingSong: true,
            isBroadcasting: true,
            currentJockey,
            roomId,
            currentStreamingQueue: songs,
          });
          playTrackPlayerAlbum(songs, 0);
          break;
        }
      }
    });

    socket.on(
      "sync-state",
      async ({
        isPlaying,
        isBroadcasting,
        time,
        song,
        currentJockey,
        requestedUser,
        roomId,
        songs = [],
      }) => {
        if (song) {
          await playTrackPlayerSong(song);
        } else if (songs && Array.isArray(songs) && songs.length > 0) {
          set({ currentStreamingQueue: songs });
          await playTrackPlayerAlbum(songs, 0);
        }

        if (time > 0) {
          await TrackPlayer.seekTo(time);
        }
        if (!isPlaying) {
          await TrackPlayer.pause();
        }

        set({
          isBroadcasting,
          currentJockey,
          requestedUser,
          roomId,
          currentTime: time,
          isPlayingSong: isPlaying,
        });
      }
    );

    socket.on("sync-request", async ({ from }) => {
      const {
        socket,
        isBroadcasting,
        isPlayingSong,
        currentJockey,
        requestedUser,
        roomId,
        currentStreamingQueue,
      } = get();
      if (!socket) return;
      const currentSong = await TrackPlayer.getActiveTrack();
      const progress = await TrackPlayer.getProgress();

      socket.emit("sync-state", {
        to: from,
        isBroadcasting,
        currentJockey,
        requestedUser,
        roomId,
        isPlaying: isPlayingSong,
        time: progress.position,
        song: currentSong,
        songs: currentStreamingQueue,
      });
    });

    socket.on("newSongRequest", (data) => {
      set((state) => ({
        songRequests: [...state.songRequests, data.song],
      }));
      showToast(`New song request received from ${data.song.currentJockey}`);
    });

    socket.on("broadcastEnded", async (data) => {
      set({ isBroadcasting: false, isPlayingSong: false });

      await TrackPlayer.pause();
      showToast(data.message);
    });

    socket.on("roomDeleted", (data) => {
      useUserStore.setState((state) => ({
        rooms: state.rooms.filter((room) => room._id !== data.roomId),
      }));
      if (useRoomStore.getState().currentRoom?._id === data.roomId) {
        useRoomStore.setState({ currentRoom: null });
      }
      showToast(`${data.room.roomName} is deleted by admin`);
    });

    socket.on("kickedFromRoom", (data) => {
      useUserStore.setState({
        rooms: useUserStore
          .getState()
          .rooms.filter((room) => room._id !== data.roomId),
      });
      if (useRoomStore.getState().currentRoom?._id === data.roomId) {
        useRoomStore.setState({ currentRoom: null });
      }
      showToast(data.message);
      socket.disconnect();
      set({ socket: null });
    });

    socket.on("userKicked", (data) => {
      useRoomStore.setState({
        members: useRoomStore
          .getState()
          .members.filter((member) => member._id !== data.memberId),
      });
      showToast(data.message);
    });

    socket.on("newMessage", (data) => {
      const { currentRoom } = useRoomStore.getState();
      if (currentRoom) {
        useRoomStore.setState({
          currentRoom: {
            ...currentRoom,
            messages: [...currentRoom.messages, data.message],
          },
        });
      }
    });

    socket.on("adminDeletedMessage", (data) => {
      const { currentRoom } = useRoomStore.getState();
      if (currentRoom) {
        useRoomStore.setState({
          currentRoom: {
            ...currentRoom,
            messages: currentRoom.messages.map((message) =>
              message._id === data.messageId
                ? { ...message, message: "" }
                : message
            ),
          },
        });
      }
    });

    socket.on("deletedForEveryone", (data) => {
      const { currentRoom } = useRoomStore.getState();
      if (currentRoom) {
        useRoomStore.setState({
          currentRoom: {
            ...currentRoom,
            messages: currentRoom.messages.map((message) =>
              message._id === data.messageId
                ? { ...message, message: "" }
                : message
            ),
          },
        });
      }
    });

    socket.on("messageEdited", (data) => {
      const { currentRoom } = useRoomStore.getState();
      if (currentRoom) {
        useRoomStore.setState({
          currentRoom: {
            ...currentRoom,
            messages: currentRoom.messages.map((message) =>
              message._id === data.messageId
                ? { ...message, message: data.content }
                : message
            ),
          },
        });
      }
    });
  },
  disconnectSocket: async () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({
        isJoined: false,
        socket: null,
        isBroadcasting: false,
        isPlayingSong: false,
      });

      await TrackPlayer.reset();
      console.log("Socket disconnected.");
    }
  },
  startBroadcast: async (userId, roomId) => {
    const { socket } = get();
    if (socket) {
      await TrackPlayer.pause();
      socket.emit("initializeBroadcast", { userId, roomId });
    }
  },
  sendJoinRequest: (userId, roomId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("sendJoinRequest", { userId, roomId });
    }
  },
  playSong: (
    userId,
    roomId,
    songId,
    requestedUserId = null,
    time = 0,
    currentJockey
  ) => {
    const { socket } = get();
    if (socket) {
      socket.emit("music-control", {
        action: "play",
        userId,
        currentJockey,
        roomId,
        songId,
        requestedUserId,
        time,
      });
    }
  },
  pauseSong: (userId, roomId, time = 0) => {
    const { socket } = get();
    if (socket) {
      socket.emit("music-control", {
        action: "pause",
        userId,
        roomId,
        time,
      });
    }
  },
  playAlbum: (roomId, songs, currentJockey) => {
    const { socket } = get();
    if (socket) {
      console.log("play album called");
      socket.emit("music-control", {
        action: "play-album",
        songs,
        roomId,
        currentJockey,
      });
    }
  },
  seekSong: (userId, roomId, time) => {
    const { socket } = get();
    if (socket) {
      socket.emit("music-control", {
        action: "seek",
        userId,
        roomId,
        time,
      });
    }
  },
  joinRoom: (userId, roomId) => {
    console.log("join room called.");
    const { socket } = get();
    if (socket) {
      socket.emit("joinRoom", { userId, roomId });
    }
  },
  acceptJoinRequest: (userId, roomId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("acceptJoinRequest", { userId, roomId });
    }
  },
  rejectJoinRequest: (userId, roomId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("rejectJoinRequest", { userId, roomId });
    }
  },
  kickMember: (userId, roomId, memberId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("kickMember", { userId, roomId, memberId });
    }
  },
  leaveRoom: (roomId, userId) => {
    const { socket, disconnectSocket } = get();
    if (socket) {
      socket.emit("leaveRoom", { userId, roomId });
    }
    disconnectSocket();
    useRoomStore.setState({ currentRoom: null });
    showToast("You have left the room");
  },
  sendSongRequest: (userId, roomId, song) => {
    const { socket } = get();
    if (socket) {
      socket.emit("sendSongRequest", { userId, roomId, song });
    }
    showToast("Song request sent to admin");
  },
  endBroadcast: (userId, roomId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("endBroadcast", { userId, roomId });
    }
  },
  deleteRoom: (userId, roomId, room_id) => {
    const { socket } = get();
    set({ isLoading: true });
    if (socket) {
      socket.emit("deleteRoom", { userId, roomId, room_id });
    }
    set({ isLoading: false });
  },
  sendMessage: (content, senderId, roomId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("sendMessage", { content, senderId, roomId });
    }
  },
  adminDeleteMessage: (roomId, messageId, adminId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("adminDeleteMessage", { roomId, messageId, adminId });
    }
  },
  deleteForEveryone: (roomId, messageId, senderId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("deleteForEveryone", { roomId, messageId, senderId });
    }
  },
  editMessage: (roomId, messageId, senderId, content) => {
    const { socket } = get();
    if (socket) {
      socket.emit("editMessage", { roomId, messageId, senderId, content });
    }
  },
}));

export default useSocketStore;
