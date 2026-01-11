import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { SongRequest, TopResult } from "@/types";
import { router } from "expo-router";
import { ChevronRight, MonitorUpIcon } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, useColorScheme, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { Skeleton, SkeletonText } from "../ui/skeleton";

const TopResultCard = ({
  result,
  isLoading,
}: {
  result: TopResult;
  isLoading: boolean;
}) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const { isJoined, isBroadcasting, sendSongRequest } = useSocketStore();
  const { currentUser } = useUserStore();
  const { currentRoom } = useRoomStore();

  const handleSendSongRequest = (e: any) => {
    e.stopPropagation();
    if (!currentUser || !currentRoom) return;

    const song: SongRequest = {
      _id: result.id,
      userName: currentUser?.name,
      userId: currentUser?._id,
      title: result.title,
      albumId: "",
      imageUrl: result.image[result.image.length - 1].url,
    };
    if (isJoined && isBroadcasting && currentRoom && currentUser) {
      sendSongRequest(currentUser._id, currentRoom._id, song);
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        marginBottom: 8,
        backgroundColor: colors.component,
        borderRadius: borderRadius.md,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPressIn={() => router.push(`../../${result.type}/${result.id}`)}
    >
      <View className="flex-1 flex-row w-full gap-4 items-center">
        {isLoading ? (
          <Skeleton className="w-16 h-20 rounded-xl" />
        ) : (
          <Image
            source={{
              uri: `${result.image[result.image.length - 1].url}`,
            }}
            className="aspect-square w-24 rounded-xl"
          />
        )}
        <View className="flex-col gap-2 items-start h-full ">
          {isLoading ? (
            <SkeletonText className="w-20 h-4" />
          ) : (
            <ThemedText numberOfLines={1} type="subtitle">
              {result.title}
            </ThemedText>
          )}
          {isLoading ? (
            <SkeletonText className="w-16 h-4" />
          ) : (
            <ThemedText numberOfLines={1} type="default" className=" max-w-48">
              {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
            </ThemedText>
          )}
        </View>
      </View>
      <View className="flex-row items-center gap-4">
        {isBroadcasting && (
          <MonitorUpIcon
            onPressIn={handleSendSongRequest}
            color={colors.icon}
            title="Sent music requst"
          />
        )}

        <ChevronRight color={colors.icon} />
      </View>
    </TouchableOpacity>
  );
};

export default TopResultCard;
