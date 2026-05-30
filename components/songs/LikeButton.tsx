import { Colors } from "@/constants/Colors";
import { showToast } from "@/hooks/useToastMessage";
import { addToFavorites, getFavoriteSongs } from "@/services/userServices";
import useUserStore from "@/store/useUserStore";
import { Song } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ViewStyle,
} from "react-native";

const LikeButton = React.memo(
  ({
    style,
    currentSong,
  }: {
    style?: StyleProp<ViewStyle>;
    currentSong: Song;
  }) => {
    const colorSchema = useColorScheme();
    const colors = Colors[colorSchema === "light" ? "light" : "dark"];
    const queryClient = useQueryClient();
    const { currentUser } = useUserStore();

    const { mutate: addToFavoriteMutaion } = useMutation({
      mutationFn: (song: Song) =>
        addToFavorites({
          song,
          imageUrl: currentSong?.image?.[currentSong.image.length - 1].link,
          artists: currentSong?.artist_map.primary_artists,
        }),
      onMutate: async (song: Song) => {
        await queryClient.cancelQueries({ queryKey: ["favorites"] });
        const previousFavorites = queryClient.getQueryData<Song[]>([
          "favorites",
        ]);

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
      if (!currentUser) {
        showToast("Please login to add to favorites");
        return;
      }
      addToFavoriteMutaion({
        id: currentSong.id,
        name: currentSong.name!,
        subtitle: currentSong.subtitle!,
        image: [
          {
            link: currentSong.image![currentSong.image.length - 1].link!,
            quality: "960x960",
          },
        ],
        download_url: [
          {
            link: currentSong.download_url![currentSong.download_url.length - 1]
              .link!,
            quality: "320kbps",
          },
        ],
        album: currentSong.album!,
        album_id: currentSong.album_id!,
        duration: currentSong.duration!,
        artist_map: currentSong.artist_map!,
        release_date: currentSong.release_date,
      });
    }, [currentSong, addToFavoriteMutaion]);

    const { data: favorites = [] } = useQuery<Song[]>({
      queryKey: ["favorites"],
      queryFn: getFavoriteSongs,
      staleTime: 1000 * 60 * 5,
      enabled: !!currentUser,
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
          style,
        ]}
      >
        <Heart
          size={22}
          color={isFavorite ? "white" : colors.text}
          fill={isFavorite ? "white" : "none"}
        />
      </TouchableOpacity>
    );
  }
);

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
