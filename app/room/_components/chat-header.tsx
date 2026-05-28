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
        paddingHorizontal: screenPadding.horizontal,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colorScheme === "dark" ? "rgba(9, 13, 22, 0.45)" : "rgba(248, 250, 252, 0.45)",
        borderBottomWidth: 1,
        borderBottomColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ 
            width: 38, 
            height: 38, 
            borderRadius: 19, 
            backgroundColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)", 
            justifyContent: 'center', 
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.01)",
          }}
        >
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image
            source={{ uri: room.image }}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: colors.primary,
            }}
          />
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: colors.text,
                marginBottom: 2,
                letterSpacing: -0.3,
              }}
              numberOfLines={1}
            >
              {room.roomName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
              <Text style={{ fontSize: 11, color: colors.primary, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>LIVE</Text>
            </View>
          </View>
        </View>
      </View>
 
      <TouchableOpacity
        style={{ 
          width: 38, 
          height: 38, 
          borderRadius: 19, 
          backgroundColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)", 
          justifyContent: 'center', 
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.01)",
        }}
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
