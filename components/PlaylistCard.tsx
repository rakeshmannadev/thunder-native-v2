import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import NoDataPlaceholder from "./NoDataPlaceholder";
import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { VStack } from "./ui/vstack";

type SectionGridProps = {
  playlist: any;
  isLoading: boolean;
};
const PlaylistCard = ({ playlist, isLoading }: SectionGridProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();

  if (!playlist) return <NoDataPlaceholder />;

  const id = playlist.id || playlist.id;
  const name = playlist.name || playlist?.playlistName;
  const imageUrl = playlist?.image || playlist?.imageUrl;
  const subtitle = playlist.subtitle;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        router.push({
          pathname: "/playlist/[id]",
          params: { id },
        });
      }}
      style={{
        backgroundColor: colors.component,
        borderRadius: borderRadius.md,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Card size="sm" variant="ghost" className="p-2 rounded-lg !max-w-xs  m-0">
        <View>
          <Image
            source={{
              uri: imageUrl,
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
      </Card>
    </TouchableOpacity>
  );
};

export default PlaylistCard;
