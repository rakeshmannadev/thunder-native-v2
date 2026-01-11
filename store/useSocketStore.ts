// import useShowCustomToast from "@/hooks/useShowCustomToast";
import { axiosInstance } from "@/lib/axios";
import { Song, SongRequest, User } from "@/types";
// import toast from "react-hot-toast";
import useToastMessage from "@/hooks/useToastMessage";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import usePlayerStore from "./usePlayerStore";
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
  pauseSong: (
    userId: string,
    roomId: string,
    songId: string,
    time: number
  ) => void;
  playAlbum: (
    roomId: string,
    songs: Song[],
    currentJockey: User | null
  ) => void;

  seekSong: (
    userId: string,
    songId: string,
    roomId: string,
    time: number
  ) => void;
  endBroadcast: (userId: string, roomId: string) => void;
  joinRoom: (roomId: string, userId: string) => void;
  leaveRoom: (roomId: string, userId: string) => void;
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
    const socket = io(socketUrl, {
      query: {
        userId,
      },
      transports: ["websocket"],
      forceNew: true,
      reconnectionAttempts: 5,
    });
    set({ socket });

    // Listen to socket events inside the store
    socket.on("joinRequest", (data) => {
      const { showToast } = useToastMessage();
      useRoomStore.setState({
        joinRequests: [...useRoomStore.getState().joinRequests, data.request],
      });

      showToast("New join request received for " + data.request.room.roomName);
    });

    socket.on("joinRequestStatus", (data) => {
      if (data.status) {
        // toast.success(data.message);
        useUserStore.setState((state) => ({
          publicRooms: state.publicRooms.map((room) =>
            room._id === data.room._id
              ? { ...room, requests: [...room.requests, ...data.room.requests] }
              : room
          ),
        }));
      } else {
        // toast.error(data.message);
      }
    });

    socket.on("joinRequestRejected", (data) => {
      // const { showToast } = useShowCustomToast();
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
      // toast.success("Requst rejected");
    });

    socket.on("joinRequestAccepted", (data) => {
      // const { showToast } = useShowCustomToast();
      if (data.userId !== useUserStore.getState().currentUser?._id) {
        useUserStore.setState({
          rooms: [...useUserStore.getState().rooms, data.room],
        });
        useUserStore.setState((state) => ({
          publicRooms: state.publicRooms.filter(
            (room) => room._id !== data.room._id
          ),
        }));
        // showToast(
        //   `Join request accepted by ${data.room.roomName} admin `,
        //   data.room.image,
        //   data.room.roomName
        // );
      } else {
        useRoomStore.setState((state) => ({
          joinRequests: state.joinRequests.filter((request) => {
            request.room._id !== data.room._id &&
              request.user.userId !== data.room.requests.user.userId;
          }),
        }));
        // toast.success("Requst accepted");
      }
    });
    socket.on("adminJoins", (data) => {
      const { showToast } = useToastMessage();
      showToast(data.message);
      set({ roomId: data.roomId, isJoined: true });
    });
    socket.on("userJoins", (data) => {
      const { showToast } = useToastMessage();

      showToast(data.message);
      set({ roomId: data.roomId, isJoined: true });
      socket.emit("sync-request", { roomId: data.roomId });
    });
    socket.on("updateUsers", (data) => {
      set({ activeUsers: data.users }); // Update Zustand state
    });

    socket.on(
      "broadcastStarted",
      ({ user, roomId }: { user: User; roomId: string }) => {
        const { showToast } = useToastMessage();
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
            const response = await axiosInstance.get(`/songs/${songId}`);
            if (response.data.status) {
              const song = response.data.song;
              usePlayerStore.getState().setCurrentSong(song);
              set({
                isPlayingSong: true,
                isBroadcasting: true,
                currentJockey,
                requestedUser,
                roomId,
              });
            }
          } catch (error: any) {
            console.log(error.response.data.message);
          } finally {
            set({ isLoading: false });
          }
          break;
        case "pause": {
          const { isPlayingSong } = get();
          if (
            usePlayerStore.getState().currentSong &&
            usePlayerStore.getState().currentSong!._id === songId &&
            isPlayingSong
          ) {
            set({ isPlayingSong: false });
          }

          break;
        }
        case "seek": {
          set({ currentTime: time });
          break;
        }
        case "play-album": {
          const { songs, roomId, currentJockey } = data;

          set({ isLoading: true });

          set({
            isPlayingSong: true,
            isBroadcasting: true,
            currentJockey,
            roomId,
            currentStreamingQueue: songs,
          });
          usePlayerStore.setState({ queue: songs });
          usePlayerStore.getState().playAlbum(songs, 0);
          set({ isLoading: false });
          break;
        }
        default:
          break;
      }
    });
    socket.on(
      "sync-state",
      ({
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
          usePlayerStore.getState().setCurrentSong(song);
        } else {
          if (songs && Array.isArray(songs) && songs.length > 0) {
            set({ currentStreamingQueue: songs });
            usePlayerStore.getState().playAlbum(songs, 0);
          }
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

    // if a new listener joins, request sync from host
    socket.on("sync-request", ({ from }) => {
      const { socket } = get();

      if (!socket) return;

      socket.emit("sync-state", {
        to: from,
        isBroadcasting: get().isBroadcasting,
        currentJockey: get().currentJockey,
        requestedUser: get().requestedUser,
        roomId: get().roomId,
        isPlaying: !usePlayerStore.getState().isPlaying,
        time: 0,
        song: usePlayerStore.getState().currentSong,
        songs: get().currentStreamingQueue,
      });
    });

    socket.on("newSongRequest", (data) => {
      const { showToast } = useToastMessage();

      set((state) => ({
        songRequests: [...state.songRequests, data.song],
      }));
      // showToast(
      //   "New song requst received ",
      //   data.user.image,
      //   data.song.currentJockey
      // );
      showToast(`New song requst received from  ${data.song.currentJockey}`);
    });

    socket.on("broadcastEnded", (data) => {
      const { showToast } = useToastMessage();

      set({ isBroadcasting: false, isPlayingSong: false });
      usePlayerStore.setState({ currentSong: null, isPlaying: false });
      showToast(data.message);
    });
    socket.on("roomDeleted", (data) => {
      const { showToast } = useToastMessage();

      useUserStore.setState((state) => ({
        rooms: state.rooms.filter((room) => room._id !== data.roomId),
      }));
      useRoomStore.getState().currentRoom?._id === data.roomId &&
        useRoomStore.setState({ currentRoom: null });
      showToast(`${data.room.roomName} is deleted by admin`);
    });
    socket.on("kickedFromRoom", (data) => {
      const { showToast } = useToastMessage();

      useUserStore.setState({
        rooms: useUserStore
          .getState()
          .rooms.filter((room) => room._id !== data.roomId),
      });
      useRoomStore.getState().currentRoom?._id === data.roomId &&
        useRoomStore.setState({ currentRoom: null });

      // showToast(data.message, data.image, data.roomName);
      showToast(data.message);
      socket.disconnect();
      set({ socket: null });
    });
    socket.on("userKicked", (data) => {
      const { showToast } = useToastMessage();

      useRoomStore.setState({
        members: useRoomStore
          .getState()
          .members.filter((member) => member._id !== data.memberId),
      });
      showToast(data.message);
    });
    socket.on("newMessage", (data) => {
      console.log("newMessage: ", data);
      useRoomStore.setState((state) => ({
        currentRoom: {
          ...state.currentRoom!,
          messages: [...state.currentRoom!.messages, data.message],
        },
      }));
    });
    socket.on("adminDeletedMessage", (data) => {
      useRoomStore.setState((state) => ({
        currentRoom: {
          ...state.currentRoom!,
          messages: state.currentRoom!.messages.map((message) =>
            message._id === data.messageId
              ? { ...message, message: "" }
              : message
          ),
        },
      }));
    }),
      socket.on("deletedForEveryone", (data) => {
        useRoomStore.setState((state) => ({
          currentRoom: {
            ...state.currentRoom!,
            messages: state.currentRoom!.messages.map((message) =>
              message._id === data.messageId
                ? { ...message, message: "" }
                : message
            ),
          },
        }));
      }),
      socket.on("messageEdited", (data) => {
        useRoomStore.setState((state) => ({
          currentRoom: {
            ...state.currentRoom!,
            messages: state.currentRoom!.messages.map((message) =>
              message._id === data.messageId
                ? { ...message, message: data.content }
                : message
            ),
          },
        }));
      });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({
        isJoined: false,
        socket: null,
        isBroadcasting: false,
        isPlayingSong: false,
      });
      usePlayerStore.setState({ currentSong: null, isPlaying: false });

      console.log("Socket disconnected.");
    }
  },
  startBroadcast: (userId: string, roomId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit("initializeBroadcast", { userId, roomId });
    }
  },
  sendJoinRequest: async (userId, roomId) => {
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
        currentJockey: currentJockey,
        roomId,
        songId,
        requestedUserId,
        time: time,
      });
    }
  },
  pauseSong: (userId, roomId, songId, time = 0) => {
    const { socket } = get();
    if (socket) {
      socket.emit("music-control", {
        action: "pause",
        userId,
        roomId,
        songId,
        time,
      });
    }
  },
  playAlbum: (roomId: string, songs: Song[], currentJockey: User | null) => {
    const { socket } = get();
    if (socket) {
      socket.emit("music-control", {
        action: "play-album",
        songs,
        roomId,
        currentJockey,
      });
    }
  },
  seekSong: (userId: string, songId: string, roomId: string, time: number) => {
    const { socket } = get();
    if (socket) {
      socket.emit("music-control", {
        action: "seek",
        userId,
        songId,
        roomId,
        time,
      });
    }
  },
  joinRoom: (userId: string, roomId: string) => {
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
      console.log("Called");
      socket.emit("kickMember", { userId, roomId, memberId });
    }
  },
  leaveRoom: (roomId: string, userId: string) => {
    const { socket } = get();
    const { showToast } = useToastMessage();

    if (socket) {
      socket.emit("leaveRoom", { userId, roomId });
    }
    set({ isPlayingSong: false, isBroadcasting: false, isJoined: false });
    showToast("You have left the room");
  },
  sendSongRequest: (userId, roomId, song) => {
    const { socket } = get();
    const { showToast } = useToastMessage();

    if (socket) {
      socket.emit("sendSongRequest", { userId, roomId, song });
    }
    showToast("Song request send to admin");
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
