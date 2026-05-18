import TopAlbumsCard from "@/components/album/TopAlbumsCard";
import Categories from "@/components/categories/Categories";
import ChartCard from "@/components/ChartCard";
import FeaturedCard from "@/components/featured/FeaturedCard";
import RecentlyPlayedCard from "@/components/RecentlyPlayedCard";
import SearchBox from "@/components/searchbox/SearchBox";
import ShowCard from "@/components/ShowCard";
import SongCard from "@/components/SongCard";
import { ThemedText } from "@/components/ThemedText";
import TopArtistCard from "@/components/TopArtist/TopArtistCard";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { getRandomIndex } from "@/helpers/utils";
import {
  getCharts,
  getFeaturedSongs,
  getShows,
  getTopAlbums,
  getTopArtists,
  getTrendingSongs,
} from "@/services/songService";
import { getFavoriteSongs, getRecentlyPlayed } from "@/services/userServices";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowRight, Bell, Settings } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
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
  const { currentUser } = useUserStore();
  const { selectedCategory } = usePlayerStore();
  const { top } = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  // Stabilize random page numbers so they persist across re-renders
  // but change when user explicitly pulls to refresh
  const randomPages = useMemo(
    () => ({
      trending: getRandomIndex(),
      featured: getRandomIndex(),
      topArtists: getRandomIndex(),
      topAlbums: getRandomIndex(),
      charts: getRandomIndex(),
      shows: getRandomIndex(),
    }),
    [refreshKey]
  );

  // Queries
  const {
    data: trendingRes,
    isLoading: trendingLoading,
    refetch: refetchTrending,
  } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrendingSongs({ page: randomPages.trending, limit: 10 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const {
    data: featuredRes,
    isLoading: featuredLoading,
    refetch: refetchFeatured,
  } = useQuery({
    queryKey: ["featured"],
    queryFn: () => getFeaturedSongs({ page: randomPages.featured, limit: 10 }),
    staleTime: 5 * 60 * 1000,
  });
  const {
    data: topArtistsRes,
    isLoading: topArtistsLoading,
    refetch: refetchTopArtists,
  } = useQuery({
    queryKey: ["topArtists"],
    queryFn: () => getTopArtists({ limit: 10, page: randomPages.topArtists }),
    staleTime: 5 * 60 * 1000,
  });
  const {
    data: topAlbumsRes,
    isLoading: topAlbumsLoading,
    refetch: refetchTopAlbums,
  } = useQuery({
    queryKey: ["topAlbums"],
    queryFn: () => getTopAlbums({ limit: 10, page: randomPages.topAlbums }),
    staleTime: 5 * 60 * 1000,
  });
  const {
    data: chartsRes,
    isLoading: chartsLoading,
    refetch: refetchCharts,
  } = useQuery({
    queryKey: ["charts"],
    queryFn: () => getCharts({ page: randomPages.charts, limit: 10 }),
    enabled: selectedCategory === "charts",
    staleTime: 5 * 60 * 1000,
  });
  const {
    data: showsRes,
    isLoading: showsLoading,
    refetch: refetchShows,
  } = useQuery({
    queryKey: ["shows"],
    queryFn: () => getShows({ page: randomPages.shows, limit: 10 }),
    enabled: selectedCategory === "shows",
    staleTime: 5 * 60 * 1000,
  });

  useQuery({
    queryKey: ["favorites"],
    queryFn: getFavoriteSongs,
    enabled: !!currentUser,
  });

  const { data: recentlyPlayed } = useQuery({
    queryKey: ["recently-played"],
    queryFn: getRecentlyPlayed,
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
    // Bump refreshKey to regenerate random page numbers
    setRefreshKey((prev) => prev + 1);
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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <ThemedText style={[styles.greeting, { color: colors.textMuted }]}>
              {greeting}
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
    ),
    [colors, currentUser]
  );

  const sections = React.useMemo(
    () => [
      {
        title: "Continue Listening",
        data: recentlyPlayed,
        type: "recentlyPlayed",
        isLoading: false,
        hideIfEmpty: true,
      },
      {
        title: "Featured For You",
        data: featured,
        type: "featured",
        isLoading: featuredLoading,
        route: "/featured",
      },
      {
        title: "Trending Now",
        data: trending,
        type: "trending",
        isLoading: trendingLoading,
        route: "/trending",
      },
      {
        title: "Top Artists",
        data: topArtists,
        type: "artists",
        isLoading: topArtistsLoading,
        route: "/artists",
      },
      {
        title: "Popular Albums",
        data: topAlbums,
        type: "albums",
        isLoading: topAlbumsLoading,
        route: "/albums",
      },
    ],
    [
      recentlyPlayed,
      featured,
      featuredLoading,
      trending,
      trendingLoading,
      topArtists,
      topArtistsLoading,
      topAlbums,
      topAlbumsLoading,
    ]
  );

  const keyExtractor = useCallback(
    (item: any, index: number) => {
      if (selectedCategory === "charts" || selectedCategory === "shows") {
        return item.id?.toString() || index.toString();
      }
      return item.title || index.toString();
    },
    [selectedCategory]
  );

  const renderItem = useCallback(
    ({ item, index }: any) => {
      if (selectedCategory === "charts") {
        return <ChartCard chart={item} isLoading={chartsLoading} />;
      }
      if (selectedCategory === "shows") {
        return <ShowCard show={item} isLoading={showsLoading} />;
      }

      if (item.hideIfEmpty && (!item.data || item.data.length === 0))
        return null;

      return <SectionItem item={item} index={index} colors={colors} />;
    },
    [selectedCategory, chartsLoading, showsLoading, colors]
  );

  const listData = React.useMemo(() => {
    if (selectedCategory === "charts")
      return chartsLoading ? SKELETON_DATA : charts;
    if (selectedCategory === "shows")
      return showsLoading ? SKELETON_DATA : shows;
    return sections;
  }, [selectedCategory, chartsLoading, charts, showsLoading, shows, sections]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
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
            : undefined
        }
        contentContainerStyle={styles.listContent}
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
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const SectionItem = React.memo(({ item, index, colors }: any) => {
  const renderInnerItem = useCallback(
    ({ item: subItem, index: subIndex }: any) => {
      let content = null;
      switch (item.type) {
        case "recentlyPlayed":
          content = <RecentlyPlayedCard song={subItem} isLoading={item.isLoading} />;
          break;
        case "featured":
          content = <FeaturedCard featured={subItem} isLoading={item.isLoading} />;
          break;
        case "trending":
          content = <SongCard song={subItem} isLoading={item.isLoading} />;
          break;
        case "artists":
          content = <TopArtistCard artist={subItem} isLoading={item.isLoading} />;
          break;
        case "albums":
          content = <TopAlbumsCard album={subItem} isLoading={item.isLoading} />;
          break;
      }

      return <View style={styles.cardWrapper}>{content}</View>;
    },
    [item.type, item.isLoading]
  );

  const innerKeyExtractor = useCallback(
    (_: any, i: number) => `${item.title}-${i}`,
    [item.title]
  );

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={styles.sectionContainer}
    >
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>{item.title}</ThemedText>
        {item.route && (
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => router.push(item.route)}
          >
            <ThemedText style={[styles.seeAllText, { color: colors.primary }]}>
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
        keyExtractor={innerKeyExtractor}
        renderItem={renderInnerItem}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 120,
  },
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
