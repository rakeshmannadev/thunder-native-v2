import AlbumCard from "@/components/AlbumCard";
import SongCard from "@/components/SongCard";
import { ThemedText } from "@/components/ThemedText";
import { VStack } from "@/components/ui/vstack";
import { FlatList, ScrollView, useColorScheme, View } from "react-native";

import SongCardSkeleton from "@/components/skeleton/SongCardSkeleton";
import { Colors } from "@/constants/Colors";
import useMusicStore from "@/store/useMusicStore";
import usePlayerStore from "@/store/usePlayerStore";
import { Album, Song } from "@/types";
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

  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchMadeForYouAlbums();
    fetchTrendingSongs();
    fetchFeaturedSongs();
  }, []);

  useEffect(() => {
    initializeQueue([...trending, ...featured]);
  }, [trending, featured]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          Colors[colorScheme === "light" ? "light" : "dark"].background,
      }}
    >
      <ScrollView>
        {/* Recently played section */}
        <VStack space="md" className=" p-2 mt-16">
          <View className="w-full flex flex-row justify-between items-center pr-2">
            <ThemedText type="subtitle" className="px-3">
              Recently Played
            </ThemedText>

            <ThemedText
              type="link"
              className="hover:bg-hover-background p-2 rounded-3xl"
            >
              See all
            </ThemedText>
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
              renderItem={({ item: Song, index }) =>
                isLoading ? (
                  <SongCardSkeleton />
                ) : (
                  <SongCard song={Song} isLoading={isLoading} index={index} />
                )
              }
            />
          }
        </VStack>
        {/* Trending section */}
        <VStack space="md" className="mt-2 p-2">
          <View className="w-full flex flex-row justify-between items-center pr-2">
            <ThemedText type="subtitle" className="px-3">
              Trending
            </ThemedText>
            <ThemedText
              type="link"
              className="hover:bg-hover-background p-2 rounded-3xl"
            >
              See all
            </ThemedText>
          </View>
          {
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: Song) =>
                isLoading ? `skeleton-${Math.random()}` : item._id.toString()
              }
              data={isLoading ? Array.from({ length: 5 }) : trending}
              renderItem={({ item: Song, index }) =>
                isLoading ? (
                  <SongCardSkeleton />
                ) : (
                  <SongCard song={Song} isLoading={isLoading} index={index} />
                )
              }
            />
          }
        </VStack>
        {/* Albums section */}
        <VStack space="md" className="mt-2 p-2">
          <View className="w-full flex flex-row justify-between items-center pr-2">
            <ThemedText type="subtitle" className="px-3">
              Albums
            </ThemedText>
            <ThemedText
              type="link"
              className="hover:bg-hover-background p-2 rounded-3xl"
            >
              See all
            </ThemedText>
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
