import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, useColorScheme } from "react-native";

const AlbumPlayButton = ({ handlePlay }: { handlePlay: () => void }) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  return (
    <TouchableOpacity
      onPress={handlePlay}
      style={{
        // paddingHorizontal: 12,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 4,
        paddingVertical: 12,
      }}
    >
      <Text style={{ color: "white" }}>Play</Text>
      <MaterialCommunityIcons name="play" size={22} color={"white"} />
    </TouchableOpacity>
  );
};

export default AlbumPlayButton;
