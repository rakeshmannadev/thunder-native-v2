import AlbumCard from "@/components/AlbumCard";
import SongCard from "@/components/SongCard";
import { ThemedText } from "@/components/ThemedText";
import { VStack } from "@/components/ui/vstack";
import { FlatList, ScrollView, useColorScheme, View } from "react-native";

import SearchBox from "@/components/searchbox/SearchBox";
import SongCardSkeleton from "@/components/skeleton/SongCardSkeleton";
import { Colors } from "@/constants/Colors";
import useMusicStore from "@/store/useMusicStore";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { Album, Song } from "@/types";
import { ArrowRightIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const {
    isLoading,
    madeForYouAlbums,
    trending,
    featured,
    fetchMadeForYouAlbums,
    fetchTrendingSongs,
    fetchFeaturedSongs,
  } = useMusicStore();
  const { currentUser, favoriteSongs, getFavoriteSongs } = useUserStore();
  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    if (
      madeForYouAlbums.length <= 0 ||
      trending.length <= 0 ||
      featured.length <= 0
    ) {
      fetchMadeForYouAlbums();
      fetchTrendingSongs();
      fetchFeaturedSongs();
    }
  }, []);

  useEffect(() => {
    if (trending.length > 0 || featured.length > 0) {
      initializeQueue([...trending, ...featured]);
    }
  }, [trending, featured]);

  useEffect(() => {
    if (currentUser && favoriteSongs.length === 0) {
      getFavoriteSongs();
    }
  }, [currentUser]); // Added currentUser to dependencies

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <FlatList
        data={[
          {
            title: "Recently Played",
            data: featured,
            renderItem: (item: Song, index: number) => (
              <SongCard key={item?._id ?? index} song={item} isLoading={isLoading} />
            ),
          },
          {
            title: "Trending",
            data: trending,
            renderItem: (item: Song, index: number) => (
              <SongCard key={item?._id ?? index} song={item} isLoading={isLoading} />
            ),
          },
          {
            title: "Albums",
            data: madeForYouAlbums,
            renderItem: (item: Album, index: number) => (
              <AlbumCard
                key={item?._id ?? index}
                album={item}
                isLoading={isLoading}
              />
            ),
          },
        ]}
        renderItem={({ item: section }) => (
          <HomeScreenSection
            section={section}
            colors={colors}
            isLoading={isLoading}
          />
        )}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={
          <VStack space="md" className="p-2 mt-16">
            <SearchBox />
          </VStack>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}

const HomeScreenSection = React.memo(
  ({
    section,
    colors,
    isLoading,
  }: {
    section: any;
    colors: any;
    isLoading: boolean;
  }) => (
    <VStack space="md" className="mt-2 p-2">
      <View className="w-full flex flex-row justify-between items-center pr-2">
        <ThemedText
          type="subtitle"
          className="px-3"
          style={{ color: colors.text }}
        >
          {section.title}
        </ThemedText>
        <ArrowRightIcon size={20} color={colors.text} />
      </View>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={5}
        windowSize={5}
        removeClippedSubviews={true}
        keyExtractor={(item: any, index) =>
          isLoading
            ? `skeleton-${index}`
            : item?._id?.toString() ?? `item-${index}`
        }
        data={isLoading ? Array.from({ length: 5 }) : section.data}
        renderItem={({ item, index }) => section.renderItem(item as any, index)}
      />
    </VStack>
  )
);
