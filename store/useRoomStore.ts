import useToastMessage from "@/hooks/useToastMessage";
import { axiosInstance } from "@/lib/axios";
import { Requests, Room, User } from "@/types";
import { create } from "zustand";
import useUserStore from "./useUserStore";
// import toast from "react-hot-toast";

interface RoomStore {
  activeMembers: User[];
  members: User[];
  joinRequests: Requests[];
  currentRoom: Room | null;
  isLoading: boolean;
  fetchingRoom: boolean;
  createRoom: (
    roomName: string,
    visability: string,
    imageFile: any
  ) => Promise<boolean>;
  fetchActiveMembers: (users: string[]) => Promise<void>;
  fetchRoomMembers: (roomId: string) => Promise<void>;
  getRoomById: (roomId: string) => Promise<void>;
  joinPublicRoom: (roomId: string) => Promise<boolean>;
  leaveJoinedRoom: (roomId: string) => Promise<void>;
  fetchJoinRequests: (roomIds: string[]) => Promise<void>;
}

const useRoomStore = create<RoomStore>((set) => ({
  activeMembers: [],
  members: [],
  joinRequests: [],
  currentRoom: null,
  isLoading: false,
  fetchingRoom: false,
  createRoom: async (roomName, visability, imageFile) => {
    const { showToast } = useToastMessage();
    set({ isLoading: true });

    try {
      const formData = new FormData();
      formData.append("roomName", roomName);
      formData.append("visability", visability);
      formData.append("imageFile", {
        uri: imageFile.uri,
        name: imageFile.fileName || "room_image.jpg",
        type: imageFile.mimeType || "image/jpeg",
      } as any);

      const response = await axiosInstance.post(
        "/rooms/create-room",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status) {
        useUserStore.setState({
          rooms: [...useUserStore.getState().rooms, response.data.room],
        });
        showToast(response.data.message);
        return true;
      }
      return false;
    } catch (error: any) {
      console.log(error);
      showToast(error.response.data.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  fetchActiveMembers: async (users) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/rooms/getActiveUsers", {
        users,
      });
      set({ activeMembers: response.data.users });
    } catch (error: any) {
      console.log(error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchRoomMembers: async (roomId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/rooms/getRoomMembers/${roomId}`
      );
      set({ members: response.data.participants });
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  getRoomById: async (roomId) => {
    set({ fetchingRoom: true });

    try {
      const response = await axiosInstance.get(`/rooms/getRoomById/${roomId}`);

      if (response.data.status) {
        set({ currentRoom: response.data.room });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      set({ fetchingRoom: false });
    }
  },
  joinPublicRoom: async (roomId) => {
    const { showToast } = useToastMessage();
    try {
      const response = await axiosInstance.put(
        `/user/join-public-room/${roomId}`
      );
      if (response.data.status) {
        useUserStore.setState({
          rooms: [...useUserStore.getState().rooms, response.data.room],
        });
        showToast(response.data.message);
        return true;
      }
      return false;
    } catch (error: any) {
      console.log(error.response.data.message);
      showToast(error.response.data.message);
      return false;
    }
  },
  leaveJoinedRoom: async (roomId) => {
    try {
      const response = await axiosInstance.put(`/user/leave-room/${roomId}`);
      if (response.data.status) {
        useUserStore.setState({
          rooms: useUserStore
            .getState()
            .rooms.filter((room) => room._id !== roomId),
        });
        set({ currentRoom: null });
        // toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      // toast.error(error.response.data.message);
    }
  },
  fetchJoinRequests: async (roomIds) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(`/user/getJoinRequests`, {
        roomIds,
      });
      set({ joinRequests: response.data.requests });
    } catch (error: any) {
      console.log(error.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useRoomStore;
