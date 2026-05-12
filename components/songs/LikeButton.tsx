import { Colors } from "@/constants/Colors";
import { showToast } from "@/hooks/useToastMessage";
import { addToFavorites, getFavoriteSongs } from "@/services/userServices";
import { Song } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { useActiveTrack } from "react-native-track-player";

const LikeButton = React.memo(() => {
  const currentSong = useActiveTrack();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const queryClient = useQueryClient();

  const { mutate: addToFavoriteMutaion } = useMutation({
    mutationFn: (song: Song) =>
      addToFavorites({
        song,
        imageUrl: currentSong?.artwork,
        artists: currentSong?.artist_map.primary_artists,
      }),
    onMutate: async (song: Song) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previousFavorites = queryClient.getQueryData<Song[]>(["favorites"]);

      queryClient.setQueryData<Song[]>(["favorites"], (old) => {
        if (!old) return [song];
        const isAlreadyFav = old.some((s) => s.id === song.id);
        if (isAlreadyFav) {
          return old.filter((s) => s.id !== song.id);
        } else {
          return [...old, song];
        }
      });

      return { previousFavorites };
    },
    onSuccess: () => {
      showToast("Favorites updated");
    },
    onError: (error: any, song, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
      showToast(error?.message || "Failed to update favorites");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const handleAddToFavorite = useCallback(async () => {
    if (!currentSong) return;
    addToFavoriteMutaion({
      id: currentSong.id,
      name: currentSong.title!,
      subtitle: currentSong.artist!,
      image: [{ link: currentSong.artwork!, quality: "960x960" }],
      download_url: [{ link: currentSong.url!, quality: "320kbps" }],
      album: currentSong.album!,
      album_id: currentSong.album_id!,
      duration: currentSong.duration!,
      artist_map: currentSong.artist_map.primary_artists!,
      release_date: currentSong.release_date,
    });
  }, [currentSong, addToFavoriteMutaion]);

  const { data: favorites = [] } = useQuery<Song[]>({
    queryKey: ["favorites"],
    queryFn: getFavoriteSongs,
    staleTime: 1000 * 60 * 5,
  });
  const isFavorite = useMemo(
    () => favorites?.some((fav) => fav.id === currentSong?.id),
    [favorites, currentSong?.id]
  );
  return (
    <TouchableOpacity
      onPress={handleAddToFavorite}
      style={[
        styles.circularActionBtn,
        isFavorite && { backgroundColor: "#ff4b2b" },
      ]}
    >
      <Heart
        size={22}
        color={isFavorite ? "white" : colors.text}
        fill={isFavorite ? "white" : "none"}
      />
    </TouchableOpacity>
  );
});

export default LikeButton;

const styles = StyleSheet.create({
  circularActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(128,128,128,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});
