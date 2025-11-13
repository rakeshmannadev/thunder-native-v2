import { ThemedText } from "@/components/ThemedText";
import AlbumResultCard from "@/components/search/AlbumResultCard";
import ArtistResultCard from "@/components/search/ArtistResultCard";
import DefaultScreen from "@/components/search/DefaultScreen";
import NotFound from "@/components/search/NotFound";
import PlaylistResultCard from "@/components/search/PlaylistResultCard";
import RecentSearches from "@/components/search/RecentSearches";
import SongResultCard from "@/components/search/SongResultCard";
import TopResultCard from "@/components/search/TopResultCard";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import useMusicStore from "@/store/useMusicStore";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type ResultItem = {
  id?: string | number;
  [key: string]: any;
};

type Section = {
  key: string;
  title: string;
  data: ResultItem[];
  // A React component that takes { result, isLoading }
  component: React.ComponentType<{ result: any; isLoading: boolean }>;
};

const index = () => {
  const colorSchema = useColorScheme();
  const { searchedSongs, searchLoading } = useMusicStore();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const { top } = useSafeAreaInsets();

  if (searchLoading)
    return (
      <View
        style={{ backgroundColor: colors.background }}
        className="flex flex-1 justify-center items-center"
      >
        <ActivityIndicator
          size={"large"}
          color={colors.primary}
          animating={searchLoading}
        />
      </View>
    );
  // Show default screen when no search has been made
  if (!searchLoading && !searchedSongs) return <DefaultScreen />;
  if (
    !searchLoading &&
    searchedSongs &&
    Object.keys(searchedSongs).length === 0
  )
    return <NotFound />;
  if (!searchedSongs) return null;

  const sections: Section[] = [
    {
      key: "top",
      title: "Top result",
      data: searchedSongs.topQuery.results,
      component: TopResultCard,
    },
    {
      key: "songs",
      title: "Songs",
      data: searchedSongs.songs.results,
      component: SongResultCard,
    },
    {
      key: "albums",
      title: "Albums",
      data: searchedSongs.albums.results,
      component: AlbumResultCard,
    },
    {
      key: "playlists",
      title: "Playlists",
      data: searchedSongs.playlists.results,
      component: PlaylistResultCard,
    },
    {
      key: "artists",
      title: "Artists",
      data: searchedSongs.artists.results,
      component: ArtistResultCard,
    },
  ];

  const renderSection: ListRenderItem<Section> = ({ item }) => {
    const CardComponent = item.component;
    return (
      <View style={[styles.sectionContainer, { marginTop: top + 40 }]}>
        <ThemedText
          type="subtitle"
          numberOfLines={1}
          style={{ marginBottom: 8 }}
        >
          {item.title}
        </ThemedText>

        <FlatList
          data={item.data}
          keyExtractor={(res, index) =>
            res.id ? res.id.toString() : index.toString()
          }
          renderItem={({ item: result }) => (
            <CardComponent result={result} isLoading={searchLoading} />
          )}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          Colors[colorSchema === "light" ? "light" : "dark"].background,
        paddingHorizontal: screenPadding.horizontal,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <RecentSearches />
        <FlatList
          data={sections}
          keyExtractor={(item) => item.key}
          renderItem={renderSection}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        />

        {/* Not found screen */}
        {/* {!searchLoading && !searchedSongs && <NotFound />} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 4,
    gap: 4,
  },
});
