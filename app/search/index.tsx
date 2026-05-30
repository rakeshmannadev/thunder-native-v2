import { ThemedText } from "@/components/ThemedText";
import AlbumResultCard from "@/components/search/AlbumResultCard";
import ArtistResultCard from "@/components/search/ArtistResultCard";
import DefaultScreen from "@/components/search/DefaultScreen";
import NotFound from "@/components/search/NotFound";
import PlaylistResultCard from "@/components/search/PlaylistResultCard";
import SongResultCard from "@/components/search/SongResultCard";
import TopResultCard from "@/components/search/TopResultCard";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import useDebounceSearch from "@/hooks/useDebouceSearch";
import { searchSongQuery } from "@/services/songService";
import useMusicStore from "@/store/useMusicStore";
import useSearchStore from "@/store/useSearchStore";
import { SearchedSong } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type ResultItem = {
  id?: string | number;
  [key: string]: any;
};

type SectionData = {
  key: string;
  title: string;
  data: ResultItem[];
  component: React.ComponentType<{ result: any; isLoading: boolean }>;
};

const SearchScreen = () => {
  const colorSchema = useColorScheme();
  const { searchQuery } = useMusicStore();
  const debouncedValue = useDebounceSearch(searchQuery, 1000);

  const { data: searchedSongRes, isLoading: searchLoading } = useQuery({
    queryKey: ["search", debouncedValue],
    queryFn: () => searchSongQuery(debouncedValue),
    enabled: debouncedValue.length > 0,
    select: (response) => response.data,
  });

  const searchedSongs: SearchedSong = searchedSongRes?.song;
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const { addRecentSearch } = useSearchStore();

  // Auto-save to recent searches whenever the debounced query fires
  useEffect(() => {
    if (debouncedValue.trim().length > 0) {
      addRecentSearch(debouncedValue.trim());
    }
  }, [debouncedValue]);

  if (searchLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!debouncedValue) return <DefaultScreen />;

  if (searchedSongs && Object.keys(searchedSongs).length === 0)
    return <NotFound />;

  if (!searchedSongs) return <DefaultScreen />;

  const sections: SectionData[] = [
    {
      key: "top",
      title: "Top Result",
      data: searchedSongs.top_query?.data || [],
      component: TopResultCard,
    },
    {
      key: "songs",
      title: "Songs",
      data: searchedSongs.songs?.data || [],
      component: SongResultCard,
    },
    {
      key: "albums",
      title: "Albums",
      data: searchedSongs.albums?.data || [],
      component: AlbumResultCard,
    },
    {
      key: "playlists",
      title: "Playlists",
      data: searchedSongs.playlists?.data || [],
      component: PlaylistResultCard,
    },
    {
      key: "artists",
      title: "Artists",
      data: searchedSongs.artists?.data || [],
      component: ArtistResultCard,
    },
  ].filter((section) => section.data.length > 0);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section, index) => (
          <Animated.View
            key={section.key}
            entering={FadeInDown.delay(index * 100).duration(600)}
            style={styles.sectionContainer}
          >
            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
            <View style={styles.sectionList}>
              {section.data.map((item, idx) => (
                <section.component
                  key={item.id || `${section.key}-${idx}`}
                  result={item}
                  isLoading={false}
                />
              ))}
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  sectionList: {
    gap: 12,
  },
  idleContent: {
    paddingTop: 8,
  },
});

export default SearchScreen;
