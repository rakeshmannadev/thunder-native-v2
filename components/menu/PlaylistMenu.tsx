import { Colors } from "@/constants/Colors";
import { Playlist } from "@/types";
import { MoreVertical } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { TouchableOpacity, useColorScheme, ViewStyle } from "react-native";
import MenuModal, { MenuItem } from "../MenuModal";

const PlaylistMenu = ({
  styles,
  menuItems,
  iconSize = 24,
  playlist,
}: {
  styles: ViewStyle[];
  menuItems: MenuItem[];
  iconSize?: number;
  playlist?: Playlist;
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const [menuVisible, setMenuVisible] = useState(false);
  const handleCloseMenu = useCallback(() => setMenuVisible(false), []);
  const handleOpenMenu = useCallback(() => setMenuVisible(true), []);

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenMenu}
        style={[{ backgroundColor: colors.iconBackground }, ...styles]}
      >
        <MoreVertical color={colors.text} size={iconSize} />
      </TouchableOpacity>

      <MenuModal
        visible={menuVisible}
        onClose={handleCloseMenu}
        items={menuItems}
        imageUrl={playlist?.imageUrl}
        title={playlist?.playlistName}
        description={playlist?.subtitle}
        artists={playlist?.artists}
        songs={playlist ? playlist.songs : []}
      />
    </>
  );
};

export default PlaylistMenu;
