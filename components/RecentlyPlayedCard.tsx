import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { Song } from "@/types";
import { LucidePlayCircle } from "lucide-react-native";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";

const RecentlyPlayedCard = ({
  song,
  isLoading,
}: {
  song: Song;
  isLoading: boolean;
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  return (
    <View
      style={{ paddingHorizontal: screenPadding.horizontal }}
      className="flex items-center justify-between  pb-3"
    >
      <View
        style={{
          backgroundColor: colors.component,
          borderColor: colors.borderColor,
        }}
        className="flex-shrink-0 w-64  backdrop-blur-sm rounded-2xl p-3 border  flex flex-row items-center gap-4 active:bg-white/5 transition-colors"
      >
        <Image
          src={song.imageUrl}
          width={50}
          height={50}
          className="rounded-lg"
        />
        <View className="flex-1 min-w-0">
          <Text
            numberOfLines={1}
            style={{ color: colors.text }}
            className=" text-sm font-bold truncate"
          >
            {song.title}
          </Text>
          <Text
            numberOfLines={1}
            style={{ color: colors.textMuted }}
            className="text-text-secondary-dark text-xs truncate"
          >
            {song.artists.primary.map((artist) => artist.name).join(", ")}
          </Text>
          <View className="mt-1.5 flex flex-row items-center gap-1.5">
            <LucidePlayCircle size={14} color={colors.primary} />
            <Text
              style={{ color: colors.primary }}
              className="text-[9px]  uppercase tracking-widest font-bold"
            >
              Resume Listening
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecentlyPlayedCard;
