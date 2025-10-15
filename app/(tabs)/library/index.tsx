import EmptyLibrary from "@/components/EmptyLibrary";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import { defaultStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Categories = [
  {
    key: "liked",
    name: "Liked",
    icon: "heart-outline",
    path: "/library_content/index",
  },
  {
    key: "downloaded",
    name: "Downloads",
    icon: "download-outline",
    path: "/library_content/index",
  },
  {
    key: "albums",
    name: "Albums",
    icon: "albums-outline",
    path: "/library_content/index",
  },
  {
    key: "artists",
    name: "Artists",
    icon: "person-outline",
    path: "/library_content/index",
  },
  {
    key: "playlists",
    name: "Playlists",
    icon: "list-outline",
    path: "/library_content/index",
  },
];

const index = () => {
  const router = useRouter();

  const { currentUser, fetchPlaylists, getFavoriteSongs } = useUserStore();

  useEffect(() => {
    if (currentUser) {
      fetchPlaylists();
      getFavoriteSongs();
    }
  }, []);

  const colorSchema = useColorScheme();
  const { top } = useSafeAreaInsets();

  // if (isLoading)
  //   return (
  //     <View className="flex flex-1 justify-center items-center dark:bg-dark-background">
  //       <ActivityIndicator
  //         size={"large"}
  //         color={colors.primary}
  //         animating={isLoading}
  //       />
  //     </View>
  //   );

  // console.log("fav: ", favoriteSongs);

  if (!currentUser) return <EmptyLibrary />;
  return (
    <SafeAreaView
      style={[
        {
          backgroundColor:
            colorSchema === "dark"
              ? Colors["dark"].background
              : Colors["light"].background,
        },
        styles.container,
      ]}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginTop: top + 40 }}>
          <View style={styles.sectionContiner}>
            <FlatList
              data={Categories}
              keyExtractor={(item) => item.key.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 10,
                flexGrow: 1,
                alignItems: "flex-start",
                gap: 24,
                flexWrap: "wrap",
                width: "100%",
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() =>
                    router.push({
                      pathname: "/library_content",
                      params: { pagename: item.key },
                    })
                  }
                >
                  <Ionicons name={item.icon as any} size={32} color="white" />
                  <ThemedText type="defaultSemiBold" numberOfLines={1}>
                    {item.name}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ScrollView>

      {/* <VStack space="md" className="mt-10 p-2">
        <ThemedText type="subtitle" className="px-3">
          Favorites
        </ThemedText>

          {
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={favoriteSongs}
              keyExtractor={(item: Song) => item._id.toString()}
              renderItem={({ item: Song }) => (
                <SongCard song={Song} isLoading={fetchingPlaylist} />
              )}
            />
          }

      </VStack>

      <VStack space="md" className="mt-2 p-2">
        <ThemedText type="subtitle" className="px-3">
          Saved albums
        </ThemedText>
        <ScrollView>
          {
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={playlists.filter((playlist) => playlist.albumId != null)}
              keyExtractor={(item: Playlist) => item._id.toString()}
              renderItem={({ item: playlist }) => (
                <PlaylistCard
                  playlist={playlist}
                  isLoading={fetchingPlaylist}
                />
              )}
            />
          }
        </ScrollView>
      </VStack>

      <VStack space="md" className="mt-2 p-2 mb-16">
        <ThemedText type="subtitle" className="px-3">
          Saved playlists
        </ThemedText>
        <ScrollView>
          {
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={playlists.filter((playlist) => playlist.albumId == null)}
              keyExtractor={(item: Playlist) => item._id.toString()}
              renderItem={({ item: playlist }) => (
                <PlaylistCard
                  playlist={playlist}
                  isLoading={fetchingPlaylist}
                />
              )}
            />
          }
        </ScrollView>
      </VStack> */}
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    ...defaultStyles.container,

    paddingHorizontal: screenPadding.horizontal,
  },
  sectionContiner: {
    width: "100%",
    paddingHorizontal: screenPadding.horizontal,
    alignItems: "center",
  },
  card: {
    minWidth: 100,
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.025)",
  },
});
