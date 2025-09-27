import { colors } from "@/constants/tokens";
import { useTrackPlayerRepeatMode } from "@/hooks/useTrackPlayerRepeatMode";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";

type IconProps = Omit<ComponentProps<typeof MaterialCommunityIcons>, "name">;
type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const PlayerRepeatToggle = ({ ...iconProps }: IconProps) => {
  const { repeatMode, changeRepeatMode } = useTrackPlayerRepeatMode();

  // const toggleRepeatMode = () => {
  //   if (repeatMode == null) return;

  //   const currentIndex = repeatOrder.indexOf(repeatMode);
  //   const nextIndex = (currentIndex + 1) % repeatOrder.length;

  //   changeRepeatMode(repeatOrder[nextIndex]);
  // };

  // const icon = match(repeatMode)
  //   .returnType<IconName>()
  //   .with(RepeatMode.Off, () => "repeat-off")
  //   .with(RepeatMode.Track, () => "repeat-once")
  //   .with(RepeatMode.Queue, () => "repeat")
  //   .otherwise(() => "repeat-off");

  return (
    <MaterialCommunityIcons
      name={"repeat"}
      onPress={() => null}
      color={colors.icon}
    />
  );
};
