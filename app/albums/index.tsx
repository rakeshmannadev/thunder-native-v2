import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { getTopAlbums } from "@/services/songService";
import { TopAlbums } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Disc } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
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

const TopAlbumPage = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const {
    data: albumsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["top-albums-infinite"],
    queryFn: ({ pageParam = 1 }) =>
      getTopAlbums({ page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.length === 6 ? nextPage : undefined;
    },
  });

  const albums = useMemo(() => {
    return albumsData?.pages.flatMap((page) => page) || [];
  }, [albumsData]);

  const onRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    await refetch();
    setIsManualRefreshing(false);
  }, [refetch]);

  const renderItem = ({ item, index }: { item: TopAlbums; index: number }) => {
    const imageUrl =
      item?.image?.[2]?.link ||
      item?.image?.[1]?.link ||
      item?.image?.[0]?.link;

    const artists =
      item?.artist_map?.artists?.map((a) => a.name).join(", ") ||
      "Unknown Artist";

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).duration(600)}
        style={styles.cardContainer}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (item.id) {
              router.push({
                pathname: "/album/[id]",
                params: { id: item.id },
              });
            }
          }}
          style={styles.card}
        >
          <View style={styles.imageWrapper}>
            <Image source={imageUrl} style={styles.image} contentFit="cover" />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.4)"]}
              style={styles.gradient}
            />
            <View style={styles.albumBadge}>
              <Disc size={12} color="white" />
            </View>
          </View>
          <View style={styles.cardContent}>
            <ThemedText style={styles.cardName} numberOfLines={1}>
              {item.name}
            </ThemedText>
            <ThemedText
              style={[styles.cardSubtitle, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {artists}
            </ThemedText>
            {!!item.year && (
              <ThemedText
                style={[styles.yearText, { color: colors.textMuted }]}
                numberOfLines={1}
              >
                {item.year} • Album
              </ThemedText>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSkeleton = () => (
    <View style={styles.columnWrapper}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} style={styles.cardContainer}>
          <View
            style={[
              styles.card,
              {
                height: CARD_WIDTH + 70,
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
          No albums found.
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
        <ThemedText style={styles.headerTitle}>Popular Albums</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={albums}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
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
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 20,
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
    ...StyleSheet.absoluteFillObject,
  },
  albumBadge: {
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
  },
  cardName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  yearText: {
    fontSize: 11,
    fontWeight: "400",
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

export default TopAlbumPage;
