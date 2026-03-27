import { Colors } from "@/constants/Colors";
import { Playlist } from "@/types";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";
import NoDataPlaceholder from "./NoDataPlaceholder";
import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { VStack } from "./ui/vstack";

type SectionGridProps = {
  playlist: Playlist;
  isLoading: boolean;
};
const PlaylistCard = ({ playlist, isLoading }: SectionGridProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  console.log("[playlist: ", playlist);
  if (!playlist) return <NoDataPlaceholder />;
  return (
    <Card size="sm" variant="ghost" className="p-2 rounded-lg !max-w-xs  m-0">
      <Link
        href={`../${playlist.albumId == null ? "playlist" : "album"}/${
          playlist.albumId == null ? playlist.playlistId : playlist.albumId
        }`}
      >
        <View>
          <Image
            source={{
              uri: `${playlist.imageUrl}`,
            }}
            className="mb-1  w-36  rounded-md aspect-[263/240]"
            alt={playlist.playlistName}
          />
        </View>

        <VStack className="truncate w-32 ">
          <View className="w-32 h-14 truncate">
            <Heading>{playlist.playlistName}</Heading>
          </View>
          <View className="w-full h-6">
            <Text
              style={{
                fontSize: 14,
                color: colors.text,
                letterSpacing: 0.5,
                fontWeight: 700,
              }}
            >
              {playlist.artist.map((artist) => artist.name).join(", ")}
            </Text>
          </View>
        </VStack>
      </Link>
    </Card>
  );
};

export default PlaylistCard;
