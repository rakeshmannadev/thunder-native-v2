import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { getTopArtists } from "@/services/songService";
import { TopArtists } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, User } from "lucide-react-native";
import React, { useMemo, useState, useCallback } from "react";
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
const COLUMN_COUNT = 3;
const CARD_WIDTH = (width - screenPadding.horizontal * 2 - 24) / COLUMN_COUNT;

const TopArtistsPage = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const {
    data: topArtistsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["top-artists-infinite"],
    queryFn: ({ pageParam = 1 }) =>
      getTopArtists({ page: pageParam, limit: 12 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.length === 12 ? nextPage : undefined;
    },
  });

  const artists = useMemo(() => {
    return topArtistsData?.pages.flatMap((page) => page) || [];
  }, [topArtistsData]);

  const onRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    await refetch();
    setIsManualRefreshing(false);
  }, [refetch]);

  const renderItem = ({ item, index }: { item: TopArtists; index: number }) => {
    const imageUrl =
      item?.image?.[2]?.link || item?.image?.[1]?.link || item?.image?.[0]?.link;

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 30).duration(600)}
        style={styles.cardContainer}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (item.id) {
              router.push({
                pathname: "/artist/[id]",
                params: { id: item.id },
              });
            }
          }}
          style={styles.card}
        >
          <View style={styles.imageWrapper}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.imagePlaceholder,
                  { backgroundColor: colors.secondaryBackground },
                ]}
              >
                <User size={30} color={colors.textMuted} />
              </View>
            )}
          </View>
          <View style={styles.cardContent}>
            <ThemedText style={styles.cardName} numberOfLines={1}>
              {item.name}
            </ThemedText>
            {item.followerCount > 0 && (
              <ThemedText
                style={[styles.cardSubtitle, { color: colors.textMuted }]}
                numberOfLines={1}
              >
                {new Intl.NumberFormat("en", { notation: "compact" }).format(
                  item.followerCount
                )}{" "}
                Followers
              </ThemedText>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSkeleton = () => (
    <View style={styles.columnWrapper}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <View key={i} style={styles.cardContainer}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonText} />
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
          No artists found.
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
        <ThemedText style={styles.headerTitle}>Top Artists</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={artists}
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
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    alignItems: "center",
  },
  card: {
    width: "100%",
    alignItems: "center",
  },
  imageWrapper: {
    width: CARD_WIDTH * 0.9,
    aspectRatio: 1,
    borderRadius: (CARD_WIDTH * 0.9) / 2,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    alignItems: "center",
    width: "100%",
  },
  cardName: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  skeletonImage: {
    width: CARD_WIDTH * 0.9,
    aspectRatio: 1,
    borderRadius: (CARD_WIDTH * 0.9) / 2,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 10,
  },
  skeletonText: {
    width: "70%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.05)",
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

export default TopArtistsPage;
