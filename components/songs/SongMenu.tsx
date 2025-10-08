// components/songs/SongMenu.tsx
import { useRouter } from "expo-router";
import { MoreVertical } from "lucide-react-native";
import React from "react";
import { Share, View } from "react-native";
import { Button, ButtonIcon } from "../ui/button"; // your Gluestack Button
import { ContextMenu, ContextMenuItem } from "../ui/menu";

export default function SongMenu({ song }: { song?: any }) {
  const router = useRouter();

  const goToAlbum = () => {
    if (song?.albumId) router.push(`/album/${song.albumId}`);
  };

  const shareSong = async () => {
    try {
      await Share.share({
        message: `${song?.title ?? "Song"} — ${song?.audioUrl ?? ""}`,
        url: song?.audioUrl,
        title: song?.title,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ContextMenu
      width={200}
      offset={6}
      placement="bottom-right"
      trigger={({ open, ref }) => (
        // Trigger must forward ref to native View — we use a small wrapper
        <View ref={ref} collapsable={false}>
          <Button onPress={open} size="sm" variant="link">
            <ButtonIcon as={MoreVertical} />
          </Button>
        </View>
      )}
    >
      <ContextMenuItem onPress={goToAlbum}>📀 Go to album</ContextMenuItem>
      <ContextMenuItem onPress={shareSong}>📤 Share</ContextMenuItem>
      <ContextMenuItem onPress={() => console.log("Play next")}>
        ▶️ Play next
      </ContextMenuItem>
      <ContextMenuItem onPress={() => console.log("Add to playlist")}>
        ➕ Add to playlist
      </ContextMenuItem>
      <ContextMenuItem destructive onPress={() => console.log("Remove")}>
        🗑️ Remove
      </ContextMenuItem>
    </ContextMenu>
  );
}
