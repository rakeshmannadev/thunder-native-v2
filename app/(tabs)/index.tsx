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
import {
  getCharts,
  getFeaturedSongs,
  getShows,
  getTopAlbums,
  getTopArtists,
  getTrendingSongs,
} from "@/services/songService";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { Featured, Song, TopAlbums, TopArtists } from "@/types";
import { useQuery } from "@tanstack/react-query";
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
    currentUser,
    favoriteSongs,
    getFavoriteSongs,
    fetchRecentlyPlayed,
    recentlyPlayed,
  } = useUserStore();
  const { initializeQueue, selectedCategory } = usePlayerStore();

  const {
    data: trendingRes,
    isLoading: trendingLoading,
    refetch: refetchTrending,
  } = useQuery({
    queryKey: ["trending"],
    queryFn: getTrendingSongs,
  });
  const {
    data: featuredRes,
    isLoading: featuredLoading,
    refetch: refetchFeatured,
  } = useQuery({
    queryKey: ["featured"],
    queryFn: getFeaturedSongs,
  });
  const {
    data: topArtistsRes,
    isLoading: topArtistsLoading,
    refetch: refetchTopArtists,
  } = useQuery({
    queryKey: ["topArtists"],
    queryFn: getTopArtists,
  });
  const {
    data: topAlbumsRes,
    isLoading: topAlbumsLoading,
    refetch: refetchTopAlbums,
  } = useQuery({
    queryKey: ["topAlbums"],
    queryFn: getTopAlbums,
  });
  const {
    data: chartsRes,
    isLoading: chartsLoading,
    refetch: refetchCharts,
  } = useQuery({
    queryKey: ["charts"],
    queryFn: getCharts,
    enabled: selectedCategory === "charts",
  });
  const {
    data: showsRes,
    isLoading: showsLoading,
    refetch: refetchShows,
  } = useQuery({
    queryKey: ["shows"],
    queryFn: getShows,
    enabled: selectedCategory === "shows",
  });

  const trending = trendingRes?.data?.songs || [];
  const featured = featuredRes?.data?.collection?.data || [];
  const topArtists = topArtistsRes?.data?.collection || [];
  const topAlbums = topAlbumsRes?.data?.collection?.data || [];
  const charts = chartsRes?.data?.collection || [];
  const shows = showsRes?.data?.collection?.data || [];

  const { top } = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (selectedCategory === "charts") {
      await refetchCharts();
    } else if (selectedCategory === "shows") {
      await refetchShows();
    } else {
      await Promise.all([
        refetchTrending(),
        refetchFeatured(),
        refetchTopArtists(),
        refetchTopAlbums(),
      ]);
    }
    setRefreshing(false);
  }, [
    selectedCategory,
    refetchTrending,
    refetchFeatured,
    refetchTopArtists,
    refetchTopAlbums,
    refetchCharts,
    refetchShows,
  ]);

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
          data={chartsLoading ? SKELETON_DATA : charts}
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
              <ChartCard chart={item} isLoading={chartsLoading} />
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
          data={showsLoading ? SKELETON_DATA : shows}
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
              <ShowCard show={item} isLoading={showsLoading} />
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
              isLoading: false, // user store isn't loading here
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
              isLoading: featuredLoading,
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
              isLoading: trendingLoading,
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
              isLoading: topArtistsLoading,
            },
            {
              title: "Top Albums",
              data: topAlbums,
              renderItem: (item: TopAlbums, index: number) => (
                <TopAlbumsCard
                  key={item?.id ?? item?.id ?? index}
                  album={item}
                  isLoading={false}
                />
              ),
              skeletonItem: (_: any, index: number) => (
                <SongCardSkeleton key={`skeleton-albums-${index}`} />
              ),
              isLoading: topAlbumsLoading,
            },
          ]}
          renderItem={({ item: section }) => (
            <HomeScreenSection section={section} colors={colors} />
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
  ({ section, colors }: { section: any; colors: any }) => (
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
          section.isLoading
            ? `skeleton-${section.title}-${index}`
            : (_?._id?.toString() ?? `item-${index}`)
        }
        data={section.isLoading ? SKELETON_DATA : section.data}
        renderItem={({ item, index }) =>
          section.isLoading
            ? section.skeletonItem(item, index)
            : section.renderItem(item as any, index)
        }
      />
    </VStack>
  )
);
