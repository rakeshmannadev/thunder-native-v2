import { ThemedText } from "@/components/ThemedText";
import AlbumResultCard from "@/components/search/AlbumResultCard";
import ArtistResultCard from "@/components/search/ArtistResultCard";
import DefaultScreen from "@/components/search/DefaultScreen";
import PlaylistResultCard from "@/components/search/PlaylistResultCard";
import SongResultCard from "@/components/search/SongResultCard";
import TopResultCard from "@/components/search/TopResultCard";
import useMusicStore from "@/store/useMusicStore";
import React from "react";
import { FlatList, ScrollView, View } from "react-native";

const index = () => {
  const { searchedSongs, searchLoading } = useMusicStore();
  console.log(searchedSongs);
  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Search result section */}
      <View className="w-screen p-4 ">
        {!searchLoading && searchedSongs && (
          <>
            <ThemedText type="subtitle" className="pl-4  mb-2">
              Top result:{" "}
            </ThemedText>
            <FlatList
              data={searchedSongs.topQuery.results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TopResultCard result={item} isLoading={searchLoading} />
              )}
            />
          </>
        )}
      </View>

      {/* Song results */}

      <View className="w-screen p-4 ">
        {!searchLoading && searchedSongs && (
          <>
            <ThemedText type="subtitle" className="pl-4 mb-2">
              Songs:{" "}
            </ThemedText>
            <FlatList
              data={searchedSongs.songs.results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <SongResultCard result={item} isLoading={searchLoading} />
              )}
            />
          </>
        )}
      </View>

      {/* Album results */}
      <View className="w-screen p-4 ">
        {!searchLoading && searchedSongs && (
          <>
            <ThemedText type="subtitle" className="pl-4 mb-2">
              Albums:{" "}
            </ThemedText>
            <FlatList
              data={searchedSongs.albums.results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <AlbumResultCard result={item} isLoading={searchLoading} />
              )}
            />
          </>
        )}
      </View>

      {/* Playlist result */}

      <View className="w-screen p-4 ">
        {!searchLoading && searchedSongs && (
          <>
            <ThemedText type="subtitle" className="pl-4 mb-2">
              Playlists:{" "}
            </ThemedText>
            <FlatList
              data={searchedSongs.playlists.results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <PlaylistResultCard result={item} isLoading={searchLoading} />
              )}
            />
          </>
        )}
      </View>

      {/* Artist results */}

      <View className="w-screen p-4 ">
        {!searchLoading && searchedSongs && (
          <>
            <ThemedText type="subtitle" className="pl-4 mb-2">
              Artists:{" "}
            </ThemedText>
            <FlatList
              data={searchedSongs.artists.results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <ArtistResultCard result={item} isLoading={searchLoading} />
              )}
            />
          </>
        )}
      </View>

      {/* Not found screen */}
      {/* {!searchLoading && !searchedSongs && <NotFound />} */}

      {/* Default screen */}
      {!searchLoading && !searchedSongs && <DefaultScreen />}
    </ScrollView>
  );
};

export default index;
