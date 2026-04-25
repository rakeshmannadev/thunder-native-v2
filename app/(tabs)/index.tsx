import TopAlbumsCard from "@/components/album/TopAlbumsCard";
import ChartCard from "@/components/ChartCard";
import FeaturedCard from "@/components/featured/FeaturedCard";
import ShowCard from "@/components/ShowCard";
import SongCard from "@/components/SongCard";
import { ThemedText } from "@/components/ThemedText";
import TopArtistCard from "@/components/TopArtist/TopArtistCard";
import { VStack } from "@/components/ui/vstack";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  useColorScheme,
  View,
} from "react-native";

import Categories from "@/components/categories/Categories";
import RecentlyPlayedCard from "@/components/RecentlyPlayedCard";
import SearchBox from "@/components/searchbox/SearchBox";
import SongCardSkeleton from "@/components/skeleton/SongCardSkeleton";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import useMusicStore from "@/store/useMusicStore";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { Featured, Song, TopAlbums, TopArtists } from "@/types";
import { ArrowRightIcon } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SKELETON_DATA = Array.from({ length: 5 }, (_, i) => ({ _skeletonId: i }));

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
    charts,
    shows,
    fetchCharts,
    fetchShows,
    topArtists,
    fetchTopArtists,
    topAlbums,
    fetchTopAlbums,
  } = useMusicStore();
  const {
    currentUser,
    favoriteSongs,
    getFavoriteSongs,
    fetchRecentlyPlayed,
    recentlyPlayed,
  } = useUserStore();
  const { initializeQueue, selectedCategory } = usePlayerStore();

  useEffect(() => {
    if (selectedCategory === "charts") {
      fetchCharts();
    } else if (selectedCategory === "shows") {
      fetchShows();
    }
  }, [selectedCategory]);

  const { top } = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchTrendingSongs(),
      fetchFeaturedSongs(),
      fetchTopArtists(),
      fetchTopAlbums(),
    ]);
    setRefreshing(false);
  }, [fetchTrendingSongs, fetchFeaturedSongs, fetchTopArtists, fetchTopAlbums]);

  useEffect(() => {
    if (
      trending.length <= 0 ||
      featured.length <= 0 ||
      topArtists.length <= 0 ||
      topAlbums.length <= 0
    ) {
      fetchTrendingSongs();
      fetchFeaturedSongs();
      fetchTopArtists();
      fetchTopAlbums();
    }
  }, []);

  useEffect(() => {
    if (
      currentUser &&
      (favoriteSongs.length === 0 || recentlyPlayed.length === 0)
    ) {
      getFavoriteSongs();
      fetchRecentlyPlayed();
    }
  }, [currentUser]);

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      {/* Sticky Categories Section */}
      <View
        style={{
          backgroundColor: colors.background,
          paddingTop: top + 55,
          paddingBottom: 8,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 8,
            paddingHorizontal: screenPadding.horizontal,
          }}
        >
          <Categories />
        </ScrollView>
      </View>

      {/* Scrollable Content */}
      {selectedCategory === "charts" ? (
        <FlatList
          key="charts-grid"
          data={charts}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: screenPadding.horizontal,
          }}
          contentContainerStyle={{
            paddingBottom: 100,
            gap: 16,
            paddingTop: 8,
          }}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1 }}>
              <ChartCard chart={item} isLoading={isLoading} />
            </View>
          )}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          ListHeaderComponent={
            <VStack space="md" className="p-2 pb-2">
              <SearchBox />
            </VStack>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      ) : selectedCategory === "shows" ? (
        <FlatList
          key="shows-grid"
          data={shows}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: screenPadding.horizontal,
          }}
          contentContainerStyle={{
            paddingBottom: 100,
            gap: 16,
            paddingTop: 8,
          }}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1 }}>
              <ShowCard show={item} isLoading={isLoading} />
            </View>
          )}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          ListHeaderComponent={
            <VStack space="md" className="p-2 pb-2">
              <SearchBox />
            </VStack>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      ) : (
        <FlatList
          key="all-list"
          data={[
            {
              title: "Continue Listening",
              data: recentlyPlayed,
              renderItem: (item: Song, index: number) => (
                <RecentlyPlayedCard
                  key={item?._id ?? index}
                  song={item}
                  isLoading={false}
                />
              ),
              skeletonItem: (_: any, index: number) => (
                <SongCardSkeleton key={`skeleton-recently-${index}`} />
              ),
            },
            {
              title: "Featured",
              data: featured,
              renderItem: (item: Featured, index: number) => (
                <FeaturedCard
                  key={item?.id ?? item?.id ?? index}
                  featured={item}
                  isLoading={false}
                />
              ),
              skeletonItem: (_: any, index: number) => (
                <SongCardSkeleton key={`skeleton-featured-${index}`} />
              ),
            },
            {
              title: "Trending",
              data: trending,
              renderItem: (item: Song, index: number) => (
                <SongCard
                  key={item?._id ?? index}
                  song={item}
                  isLoading={false}
                />
              ),
              skeletonItem: (_: any, index: number) => (
                <SongCardSkeleton key={`skeleton-trending-${index}`} />
              ),
            },
            {
              title: "Top Artists",
              data: topArtists,
              renderItem: (item: TopArtists, index: number) => (
                <TopArtistCard
                  key={item?.id ?? index}
                  artist={item}
                  isLoading={false}
                />
              ),
              skeletonItem: (_: any, index: number) => (
                <SongCardSkeleton key={`skeleton-artists-${index}`} />
              ),
            },
            {
              title: "Top Albums",
              data: topAlbums,
              renderItem: (item: TopAlbums, index: number) => (
                <TopAlbumsCard
                  key={item?.albumId ?? item?.albumId ?? index}
                  album={item}
                  isLoading={false}
                />
              ),
              skeletonItem: (_: any, index: number) => (
                <SongCardSkeleton key={`skeleton-albums-${index}`} />
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
            <VStack space="md" className="p-2 pb-2">
              <SearchBox />
            </VStack>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}
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
        keyExtractor={(_: any, index) =>
          isLoading
            ? `skeleton-${section.title}-${index}`
            : (_?._id?.toString() ?? `item-${index}`)
        }
        data={isLoading ? SKELETON_DATA : section.data}
        renderItem={({ item, index }) =>
          isLoading
            ? section.skeletonItem(item, index)
            : section.renderItem(item as any, index)
        }
      />
    </VStack>
  )
);
