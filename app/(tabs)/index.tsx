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
import { useEffect } from "react";
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
    initializeQueue([...trending, ...featured]);
  }, [trending, featured]);

  useEffect(() => {
    if (currentUser && favoriteSongs.length === 0) {
      getFavoriteSongs();
    }
  }, []);

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView>
        {/* Recently played section */}
        <VStack space="md" className=" p-2 mt-16">
          <SearchBox />
          <View className="w-full flex flex-row justify-between items-center pr-2">
            <ThemedText
              type="subtitle"
              className="px-3"
              style={{ color: colors.text }}
            >
              Recently Played
            </ThemedText>

            <ArrowRightIcon size={20} color={colors.text} />
          </View>

          {/* Song card component */}
          {
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: Song) =>
                isLoading ? `skeleton-${Math.random()}` : item._id.toString()
              }
              data={isLoading ? Array.from({ length: 5 }) : featured}
              renderItem={({ item: Song }) =>
                isLoading ? (
                  <SongCardSkeleton />
                ) : (
                  <SongCard song={Song} isLoading={isLoading} />
                )
              }
            />
          }
        </VStack>
        {/* Trending section */}
        <VStack space="md" className="mt-2 p-2">
          <View className="w-full flex flex-row justify-between items-center pr-2">
            <ThemedText
              type="subtitle"
              className="px-3"
              style={{ color: colors.text }}
            >
              Trending
            </ThemedText>
            <ArrowRightIcon size={20} color={colors.text} />
          </View>
          {
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: Song) =>
                isLoading ? `skeleton-${Math.random()}` : item._id.toString()
              }
              data={isLoading ? Array.from({ length: 5 }) : trending}
              renderItem={({ item: Song }) =>
                isLoading ? (
                  <SongCardSkeleton />
                ) : (
                  <SongCard song={Song} isLoading={isLoading} />
                )
              }
            />
          }
        </VStack>
        {/* Albums section */}
        <VStack space="md" className="mt-2 mb-12 p-2">
          <View className="w-full flex flex-row justify-between items-center pr-2">
            <ThemedText
              type="subtitle"
              className="px-3"
              style={{ color: colors.text }}
            >
              Albums
            </ThemedText>
            <ArrowRightIcon size={20} color={colors.text} />
          </View>
          {
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: Album) =>
                isLoading ? `skeleton-${Math.random()}` : item._id.toString()
              }
              data={isLoading ? Array.from({ length: 5 }) : madeForYouAlbums}
              renderItem={({ item: Album }) =>
                isLoading ? (
                  <SongCardSkeleton />
                ) : (
                  <AlbumCard album={Album} isLoading={isLoading} />
                )
              }
            />
          }
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
