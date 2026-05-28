import { Colors } from "@/constants/Colors";
import { showToast } from "@/hooks/useToastMessage";
import { getSavedAlbums, savePlaylistToLibrary } from "@/services/userServices";
import { Playlist } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react-native";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

const AddToPlaylistButton = ({
  currentPlaylist,
}: {
  currentPlaylist: Playlist;
}) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const { data: userPlaylists, refetch: refetchUserPlaylists } = useQuery({
    queryKey: ["saved-albums"],
    queryFn: getSavedAlbums,
  });

  const isAlreadySavedInLibrary = useMemo(() => {
    return userPlaylists?.some((p: Playlist) => p.id === currentPlaylist?.id);
  }, [userPlaylists, currentPlaylist]);

  const { mutate: savePlaylistMutate, isPending: savePlaylistLoading } =
    useMutation({
      mutationKey: ["save-playlist-to-library"],
      mutationFn: () => savePlaylistToLibrary(currentPlaylist),
      onSuccess: () => {
        showToast("Playlist added to library");
        refetchUserPlaylists();
      },
      onError: (error: any) => {
        showToast(error.message);
      },
    });

  const handleSavePlaylist = async () => {
    if (!currentPlaylist || isAlreadySavedInLibrary) return;
    savePlaylistMutate();
  };

  return (
    <>
      {isAlreadySavedInLibrary ? (
        <View
          style={[
            styles.shuffleButton,
            { backgroundColor: colors.secondaryBackground },
          ]}
        >
          <MaterialCommunityIcons
            name="check-all"
            color={colors.primary}
            size={22}
          />
        </View>
      ) : (
        <Pressable
          onPress={handleSavePlaylist}
          style={[
            styles.shuffleButton,
            { backgroundColor: colors.secondaryBackground },
          ]}
        >
          <Plus
            size={22}
            color={isAlreadySavedInLibrary ? colors.primary : colors.text}
          />
        </Pressable>
      )}
    </>
  );
};

export default AddToPlaylistButton;

const styles = StyleSheet.create({
  shuffleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
