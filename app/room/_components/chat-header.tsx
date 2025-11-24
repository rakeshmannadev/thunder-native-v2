import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import { Room } from "@/types";
import { useRouter } from "expo-router";
import { MoreHorizontal } from "lucide-react-native";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ChatHeader = ({ room }: { room: Room }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top, bottom, left } = useSafeAreaInsets();
  const router = useRouter();

  const { currentUser } = useUserStore();

  if (!room) return null;
  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: screenPadding.horizontal,
        paddingLeft: left + 50,
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        borderColor: colors.borderColor,
      }}
      className="border-b pb-2"
    >
      {/* Room image section */}
      <Image
        source={{ uri: room.image }}
        style={{
          width: 40,
          //   margin: 16,
          borderRadius: borderRadius.lg,
          aspectRatio: 1,
        }}
      />
      {/* Room name section */}
      <View style={{ alignItems: "center", paddingRight: 8 }}>
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
      {/* <View style={{ paddingRight: 12 }}> */}
      <TouchableOpacity
        className="bg-gray-500/25"
        onPress={() => console.log("Pressed button")}
        // onPress={() =>
        //   router.push({
        //     pathname: "/menu",
        //     params: {
        //       items: JSON.stringify([
        //         {
        //           key: "start_broadcast",
        //           label: "Start broadcast",

        //           icon: "broadcast",
        //         },
        //         {
        //           key: "song_requests",
        //           label: "Song requests",

        //           icon: "requests",
        //         },
        //         {
        //           key: "delete_room",
        //           label: "Delete room",

        //           icon: "delete",
        //         },
        //       ]),
        //     },
        //   })
        // }
      >
        <MoreHorizontal size={20} color={colors.text} />
      </TouchableOpacity>
    </View>
    // </View>
  );
};

export default ChatHeader;
