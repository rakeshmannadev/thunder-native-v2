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

  if (!playlist) return <NoDataPlaceholder />;

  const id = playlist.id || playlist.playlistId;
  const name = playlist.name || playlist.playlistName;
  const imageUrl = playlist.image || playlist.imageUrl;
  // If artists array is present in the new format, we can map over it, or just use the subtitle
  const subtitle =
    playlist.subtitle ||
    (playlist.artists && playlist.artists.map((a: any) => a.name).join(", ")) ||
    (playlist.artist && playlist.artist.map((a: any) => a.name).join(", "));

  const href = `../${playlist.type === "album" || playlist.albumId ? "album" : "playlist"}/${
    playlist.albumId || id
  }`;

  return (
    <Card size="sm" variant="ghost" className="p-2 rounded-lg !max-w-xs  m-0">
      <Link href={href as any}>
        <View>
          <Image
            source={{
              uri: `${imageUrl}`,
            }}
            className="mb-1  w-36  rounded-md aspect-[263/240]"
            alt={name}
          />
        </View>

        <VStack className="truncate w-32 ">
          <View className="w-32 h-14 truncate">
            <Heading>{name}</Heading>
          </View>
          <View className="w-full h-6">
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: colors.text,
                letterSpacing: 0.5,
                fontWeight: 700,
              }}
            >
              {subtitle}
            </Text>
          </View>
        </VStack>
      </Link>
    </Card>
  );
};

export default PlaylistCard;
