import { MoreVertical } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useActiveTrack } from "react-native-track-player";
import MenuModal, { MenuItem } from "../MenuModal";

const SongMenu = ({
  styles,
  colors,
  menuItems,
}: {
  styles: any;
  colors: any;
  menuItems: MenuItem[];
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const currentSong = useActiveTrack();
  const handleCloseMenu = useCallback(() => setMenuVisible(false), []);
  const handleOpenMenu = useCallback(() => setMenuVisible(true), []);

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenMenu}
        style={[...styles, { backgroundColor: colors.iconBackground }]}
      >
        <MoreVertical color={colors.text} size={24} />
      </TouchableOpacity>
      <MenuModal
        visible={menuVisible}
        onClose={handleCloseMenu}
        items={menuItems}
        imageUrl={currentSong?.artwork}
        title={currentSong?.title}
        description={currentSong?.artist}
        artists={currentSong?.artist_map?.primary_artists!}
        songs={[
          {
            id: currentSong?.id,
            name: currentSong?.title!,
            subtitle: currentSong?.artist!,
            image: [
              {
                link: currentSong?.artwork!,
                quality: "900x900",
              },
            ],
            album_id: currentSong?.album_id!,
            album: currentSong?.album!,
            artist_map: currentSong?.artist_map!,
            duration: currentSong?.duration!,
            release_date: currentSong?.release_date!,
            download_url: [{ link: currentSong?.url!, quality: "320kbps" }],
          },
        ]}
      />
    </>
  );
};

export default SongMenu;
