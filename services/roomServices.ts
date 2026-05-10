import { axiosInstance } from "@/lib/axios";

export const getRoomById = async (roomId: string) => {
  try {
    const response = await axiosInstance.get(`/rooms/getRoomById/${roomId}`);
    if (response.data.status) {
      return response.data.room;
    }
    throw new Error("Failed to fetch room");
  } catch (error: any) {
    console.log(error.response.data.message);
    throw new Error(error.response.data.message);
  }
};

export const leaveRoom = async (roomId: string) => {
  try {
    const response = await axiosInstance.put(`/user/leave-room/${roomId}`);
    if (response.data.status) {
      return response.data.message;
    }
    throw new Error(response.data.message);
  } catch (error: any) {
    console.log(error.response.data.message);
    throw error;
  }
};

export const joinPublicRoom = async (roomId: string) => {
  try {
    const response = await axiosInstance.put(
      `/user/join-public-room/${roomId}`
    );
    if (response.data.status) {
      return response.data.message;
    }
    throw new Error(response.data.message);
  } catch (error: any) {
    console.log(error.response.data.message);
    throw error;
  }
};

export const createRoom = async (roomData: {
  roomName: string;
  visability: string;
  imageFile: any;
}) => {
  try {
    const formData = new FormData();
    formData.append("roomName", roomData.roomName);
    formData.append("visability", roomData.visability);
    formData.append("imageFile", {
      uri: roomData.imageFile.uri,
      name: roomData.imageFile.fileName || "room_image.jpg",
      type: roomData.imageFile.mimeType || "image/jpeg",
    } as any);
    const response = await axiosInstance.post("/rooms/create-room", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.status) {
      return response.data.room;
    }
    throw new Error(response.data.message);
  } catch (error: any) {
    console.log(error.response.data.message);
    throw error;
  }
};

export const fetchActiveMembers = async (users: string[]) => {
  try {
    const response = await axiosInstance.post(`/rooms/getActiveUsers`, {
      users,
    });
    if (response.data.status) {
      return response.data.users;
    }
    throw new Error("Failed to fetch active members");
  } catch (error: any) {
    console.log(error.response.data.message);
    throw new Error(error.response.data.message);
  }
};

export const fetchRoomMembers = async (roomId: string) => {
  try {
    const response = await axiosInstance.get(`/rooms/getRoomMembers/${roomId}`);
    if (response.data.status) {
      return response.data.participants;
    }
    throw new Error("Failed to fetch room members");
  } catch (error: any) {
    console.log(error.response.data.message);
    throw new Error(error.response.data.message);
  }
};

export const fetchJoinRequests = async (roomIds: string[]) => {
  try {
    const response = await axiosInstance.post(`/rooms/getJoinRequests`, {
      roomIds,
    });
    if (response.data.status) {
      return response.data.requests;
    }
    throw new Error("Failed to fetch join requests");
  } catch (error: any) {
    console.log(error.response.data.message);
    throw new Error(error.response.data.message);
  }
};
