import { Colors } from "@/constants/Colors";
import { showToast } from "@/hooks/useToastMessage";
import { getSavedAlbums, savePlaylistToLibrary } from "@/services/userServices";
import useUserStore from "@/store/useUserStore";
import { Playlist } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  const { currentUser } = useUserStore();
  const queryClient = useQueryClient();

  const { data: userPlaylists, refetch: refetchUserPlaylists } = useQuery({
    queryKey: ["saved-albums"],
    queryFn: getSavedAlbums,
    enabled: !!currentUser,
  });

  const isAlreadySavedInLibrary = useMemo(() => {
    return userPlaylists?.some((p: Playlist) => p.id === currentPlaylist?.id);
  }, [userPlaylists, currentPlaylist]);

  const { mutate: savePlaylistMutate, isPending: savePlaylistLoading } =
    useMutation({
      mutationKey: ["save-playlist-to-library"],
      mutationFn: () => savePlaylistToLibrary(currentPlaylist),
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["saved-albums"] });
        const previousPlaylists = queryClient.getQueryData<Playlist[]>(["saved-albums"]);
        queryClient.setQueryData<Playlist[]>(["saved-albums"], (old) => {
          return old ? [currentPlaylist, ...old] : [currentPlaylist];
        });
        return { previousPlaylists };
      },
      onError: (error: any, _variables, context) => {
        if (context?.previousPlaylists) {
          queryClient.setQueryData(["saved-albums"], context.previousPlaylists);
        }
        showToast(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["saved-albums"] });
      },
      onSuccess: () => {
        showToast("Playlist added to library");
      },
    });

  const handleSavePlaylist = async () => {
    if (!currentPlaylist || isAlreadySavedInLibrary) return;
    if (!currentUser) {
      showToast("Please login to add to your library");
      return;
    }
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
