import PlayButton from "@/components/songs/PlayButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { getTrendingSongs } from "@/services/songService";
import { Song } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, TrendingUp } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const CARD_WIDTH = (width - screenPadding.horizontal * 2 - 16) / COLUMN_COUNT;

// Only animate the first batch of items (initial screen); skip for items
// rendered during scroll to avoid heavy layout recalculations.
const ANIMATED_ITEM_LIMIT = 10;

type TrendingCardProps = {
  song: Song;
  index: number;
  colors: (typeof Colors)["dark"];
  onPress: (id: string) => void;
};

const TrendingCard = React.memo(
  ({ song, index, colors, onPress }: TrendingCardProps) => {
    const content = (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(song.id)}
        style={styles.card}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: song.image[song.image.length - 1].link }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.gradient}
          />
          <View style={styles.playButtonWrapper}>
            <PlayButton song={song} />
          </View>
          <View style={styles.trendingBadge}>
            <TrendingUp size={12} color="white" />
          </View>
        </View>
        <View style={styles.cardContent}>
          <ThemedText style={styles.cardName} numberOfLines={1}>
            {song.name}
          </ThemedText>
          <ThemedText
            style={[styles.cardSubtitle, { color: colors.textMuted }]}
            numberOfLines={1}
          >
            {song.artist_map?.primary_artists
              ? song.artist_map.primary_artists
                  .map((artist) => artist.name)
                  .join(", ")
              : "Unknown Artist"}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );

    // Only apply entering animation for the initial visible batch
    if (index < ANIMATED_ITEM_LIMIT) {
      return (
        <Animated.View
          entering={FadeInDown.delay(index * 50).duration(600)}
          style={styles.cardContainer}
        >
          {content}
        </Animated.View>
      );
    }

    return <View style={styles.cardContainer}>{content}</View>;
  },
  (prev, next) => prev.song.id === next.song.id && prev.index === next.index
);

TrendingCard.displayName = "TrendingCard";

const TrendingPage = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const {
    data: trendingSongs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["trending-infinite"],
    queryFn: ({ pageParam = 1 }) =>
      getTrendingSongs({ page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.length === 10 ? nextPage : undefined;
    },
  });

  const songs = useMemo(() => {
    return trendingSongs?.pages.flatMap((page) => page) || [];
  }, [trendingSongs]);

  const onRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    await refetch();
    setIsManualRefreshing(false);
  }, [refetch]);

  const handleSongPress = useCallback(
    (id: string) => {
      router.push(`../../song/${id}`);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Song; index: number }) => (
      <TrendingCard
        song={item}
        index={index}
        colors={colors}
        onPress={handleSongPress}
      />
    ),
    [colors, handleSongPress]
  );

  const keyExtractor = useCallback((item: Song) => item.id.toString(), []);

  const renderSkeleton = () => (
    <View style={styles.columnWrapper}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} style={styles.cardContainer}>
          <View
            style={[
              styles.card,
              {
                height: CARD_WIDTH + 60,
                opacity: 0.1,
                backgroundColor: colors.text,
              },
            ]}
          />
        </View>
      ))}
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return renderSkeleton();
    }
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={{ color: colors.textMuted }}>
          No trending songs found.
        </ThemedText>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return <View style={{ height: 40 }} />;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator color={colors.primary} size="small" />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: colors.secondaryBackground },
          ]}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Trending Now</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={COLUMN_COUNT}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onRefresh={onRefresh}
        refreshing={isManualRefreshing}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        maxToRenderPerBatch={6}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: 8,
    paddingBottom: 100,
  },
  columnWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  card: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFill,
  },
  playButtonWrapper: {
    position: "absolute",
    bottom: -20,
    right: -12,
    transform: [{ scale: 0.8 }],
  },
  trendingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cardContent: {
    padding: 12,
    paddingTop: 16,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  loaderFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    height: Dimensions.get("window").height * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TrendingPage;
