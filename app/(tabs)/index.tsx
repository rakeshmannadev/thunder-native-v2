import TopAlbumsCard from "@/components/album/TopAlbumsCard";
import Categories from "@/components/categories/Categories";
import ChartCard from "@/components/ChartCard";
import FeaturedCard from "@/components/featured/FeaturedCard";
import RecentlyPlayedCard from "@/components/RecentlyPlayedCard";
import SearchBox from "@/components/searchbox/SearchBox";
import ShowCard from "@/components/ShowCard";
import SongCardSkeleton from "@/components/skeleton/SongCardSkeleton";
import SongCard from "@/components/SongCard";
import { ThemedText } from "@/components/ThemedText";
import TopArtistCard from "@/components/TopArtist/TopArtistCard";
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
import { getFavoriteSongs } from "@/services/userServices";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { Featured, Song, TopAlbums, TopArtists } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowRight, Bell, Settings } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const SKELETON_DATA = Array.from({ length: 5 }, (_, i) => ({ _skeletonId: i }));

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { currentUser, recentlyPlayed } = useUserStore();
  const { selectedCategory } = usePlayerStore();
  const { top } = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  // Queries
  const {
    data: trendingRes,
    isLoading: trendingLoading,
    refetch: refetchTrending,
  } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrendingSongs({ page: 1, limit: 10 }),
  });
  const {
    data: featuredRes,
    isLoading: featuredLoading,
    refetch: refetchFeatured,
  } = useQuery({
    queryKey: ["featured"],
    queryFn: () => getFeaturedSongs({ page: 1, limit: 10 }),
  });
  const {
    data: topArtistsRes,
    isLoading: topArtistsLoading,
    refetch: refetchTopArtists,
  } = useQuery({
    queryKey: ["topArtists"],
    queryFn: () => getTopArtists({ limit: 10, page: 1 }),
  });
  const {
    data: topAlbumsRes,
    isLoading: topAlbumsLoading,
    refetch: refetchTopAlbums,
  } = useQuery({
    queryKey: ["topAlbums"],
    queryFn: () => getTopAlbums({ limit: 10, page: 1 }),
  });
  const {
    data: chartsRes,
    isLoading: chartsLoading,
    refetch: refetchCharts,
  } = useQuery({
    queryKey: ["charts"],
    queryFn: () => getCharts({ page: 1, limit: 10 }),
    enabled: selectedCategory === "charts",
  });
  const {
    data: showsRes,
    isLoading: showsLoading,
    refetch: refetchShows,
  } = useQuery({
    queryKey: ["shows"],
    queryFn: () => getShows({ page: 1, limit: 10 }),
    enabled: selectedCategory === "shows",
  });

  useQuery({
    queryKey: ["favorites"],
    queryFn: getFavoriteSongs,
    enabled: !!currentUser,
  });

  const trending = trendingRes || [];
  const featured = featuredRes || [];
  const topArtists = topArtistsRes || [];
  const topAlbums = topAlbumsRes || [];
  const charts = chartsRes || [];
  const shows = showsRes || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (selectedCategory === "charts") await refetchCharts();
    else if (selectedCategory === "shows") await refetchShows();
    else {
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <ThemedText style={[styles.greeting, { color: colors.textMuted }]}>
            {getGreeting()}
          </ThemedText>
          <ThemedText style={styles.userName}>
            {currentUser?.name || "Music Lover"}
          </ThemedText>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: colors.secondaryBackground },
            ]}
            onPress={() => router.push("/notification")}
          >
            <Bell size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: colors.secondaryBackground },
            ]}
            onPress={() => router.push("/settings")}
          >
            <Settings size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <SearchBox />

      <View style={styles.categoriesContainer}>
        <Categories />
      </View>
    </View>
  );

  const sections = [
    {
      title: "Continue Listening",
      data: recentlyPlayed,
      renderItem: (item: Song, index: number) => (
        <RecentlyPlayedCard
          key={item?.id ?? index}
          song={item}
          isLoading={false}
        />
      ),
      isLoading: false,
      hideIfEmpty: true,
    },
    {
      title: "Featured For You",
      data: featured,
      renderItem: (item: Featured, index: number) => (
        <FeaturedCard
          key={item?.id ?? index}
          featured={item}
          isLoading={false}
        />
      ),
      isLoading: featuredLoading,
      route: "/featured",
    },
    {
      title: "Trending Now",
      data: trending,
      renderItem: (item: Song, index: number) => (
        <SongCard key={item?.id ?? index} song={item} isLoading={false} />
      ),
      isLoading: trendingLoading,
      route: "/trending",
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
      isLoading: topArtistsLoading,
      route: "/artists",
    },
    {
      title: "Popular Albums",
      data: topAlbums,
      renderItem: (item: TopAlbums, index: number) => (
        <TopAlbumsCard key={item?.id ?? index} album={item} isLoading={false} />
      ),
      isLoading: topAlbumsLoading,
      route: "/albums",
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <FlatList
        data={
          selectedCategory === "charts"
            ? chartsLoading
              ? SKELETON_DATA
              : charts
            : selectedCategory === "shows"
              ? showsLoading
                ? SKELETON_DATA
                : shows
              : sections
        }
        keyExtractor={(item, index) =>
          selectedCategory === "charts" || selectedCategory === "shows"
            ? item.id?.toString() || index.toString()
            : item.title
        }
        numColumns={
          selectedCategory === "charts" || selectedCategory === "shows" ? 2 : 1
        }
        key={
          selectedCategory === "charts" || selectedCategory === "shows"
            ? "grid"
            : "list"
        }
        columnWrapperStyle={
          selectedCategory === "charts" || selectedCategory === "shows"
            ? {
                justifyContent: "space-between",
                paddingHorizontal: screenPadding.horizontal,
                gap: 16,
              }
            : null
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item, index }) => {
          if (selectedCategory === "charts") {
            return <ChartCard chart={item} isLoading={chartsLoading} />;
          }
          if (selectedCategory === "shows") {
            return <ShowCard show={item} isLoading={showsLoading} />;
          }

          if (item.hideIfEmpty && (!item.data || item.data.length === 0))
            return null;

          return (
            <Animated.View
              entering={FadeInDown.delay(index * 100).duration(600)}
              style={styles.sectionContainer}
            >
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>
                  {item.title}
                </ThemedText>
                {item.route && (
                  <TouchableOpacity
                    style={styles.seeAllBtn}
                    onPress={() => router.push(item.route)}
                  >
                    <ThemedText
                      style={[styles.seeAllText, { color: colors.primary }]}
                    >
                      See All
                    </ThemedText>
                    <ArrowRight size={14} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={item.isLoading ? SKELETON_DATA : item.data}
                contentContainerStyle={styles.horizontalListContent}
                keyExtractor={(_, i) => `${item.title}-${i}`}
                renderItem={({ item: subItem, index: subIndex }) => (
                  <View style={styles.cardWrapper}>
                    {item.isLoading ? (
                      <SongCardSkeleton />
                    ) : (
                      item.renderItem(subItem, subIndex)
                    )}
                  </View>
                )}
              />
            </Animated.View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: screenPadding.horizontal,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  greeting: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    marginTop: 20,
    marginHorizontal: -screenPadding.horizontal,
  },
  categoriesScroll: {
    paddingHorizontal: screenPadding.horizontal,
    gap: 8,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: screenPadding.horizontal,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "700",
  },
  horizontalListContent: {
    paddingHorizontal: screenPadding.horizontal,
    gap: 16,
  },
  cardWrapper: {
    // Add subtle shadow or spacing adjustments if needed
  },
});
