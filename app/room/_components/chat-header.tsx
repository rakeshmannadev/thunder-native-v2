import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, screenPadding } from "@/constants/tokens";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Room } from "@/types";
import { useRouter } from "expo-router";
import { ChevronLeft, MoreHorizontal } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuModal, { MenuItem } from "@/components/MenuModal";

const ChatHeader = ({ room }: { room: Room }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top, bottom, left } = useSafeAreaInsets();
  const router = useRouter();

  const { currentUser } = useUserStore();
  const { isBroadcasting } = useSocketStore();

  const [menuVisible, setMenuVisible] = useState(false);

  if (!room) return null;

  const adminMenuItems: MenuItem[] = [
    {
      key: isBroadcasting ? "stop_broadcast" : "start_broadcast",
      label: isBroadcasting ? "Stop broadcast" : "Start broadcast",
      icon: "broadcast",
    },
    {
      key: "song_requests",
      label: "Song requests",
      icon: "requests",
    },
    {
      key: "delete_room",
      label: "Delete room",
      icon: "delete",
      destructive: true,
    },
  ];

  const memberMenuItems: MenuItem[] = [
    {
      key: "request_song",
      label: "Request a song",
      icon: "requests",
      submenu: true,
    },
    {
      key: "end_session",
      label: "End session",
      icon: "disconnect",
    },
    {
      key: "leave_room",
      label: "Leave room",
      icon: "logout",
      destructive: true,
    },
  ];

  const menuItems = currentUser && currentUser._id === room.admin
    ? adminMenuItems
    : memberMenuItems;

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: screenPadding.horizontal,
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: colors.borderColor,
      }}
      className="border-b pb-2"
    >
      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        {/* Room image section */}
        <Image
          source={{ uri: room.image }}
          style={{
            width: 40,
            borderRadius: borderRadius.lg,
            aspectRatio: 1,
          }}
        />
      </View>

      {/* Room name section */}
      <View style={{ alignItems: "center", flex: 1, paddingHorizontal: 8 }}>
        <Text
          style={{
            fontSize: fontSize.base,
            fontWeight: "bold",
            color: colors.text,
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {room.roomName}
        </Text>
      </View>

      <TouchableOpacity
        className=" rounded-full p-2"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => setMenuVisible(true)}
      >
        <MoreHorizontal size={20} color={colors.text} />
      </TouchableOpacity>

      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={menuItems}
        title="Room Options"
      />
    </View>
  );
};

export default ChatHeader;
