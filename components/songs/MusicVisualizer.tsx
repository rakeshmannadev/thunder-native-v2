// components/MusicVisualizer.tsx
import { Colors } from "@/constants/Colors";
import { PlayIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useIsPlaying } from "react-native-track-player";

type Props = {
  playing?: boolean;
  size?: number;
  color?: string;
};

const MusicVisualizer = ({ size = 20 }: Props) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { playing } = useIsPlaying();

  const bar1 = useSharedValue(0.5);
  const bar2 = useSharedValue(0.8);
  const bar3 = useSharedValue(0.6);

  useEffect(() => {
    if (playing) {
      bar1.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.4, { duration: 300 })
        ),
        -1,
        true
      );
      bar2.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1,
        true
      );
      bar3.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.4, { duration: 300 })
        ),
        -1,
        true
      );
    }
  }, [playing]);

  const style1 = useAnimatedStyle(() => ({
    transform: [{ scaleY: bar1.value }],
  }));
  const style2 = useAnimatedStyle(() => ({
    transform: [{ scaleY: bar2.value }],
  }));
  const style3 = useAnimatedStyle(() => ({
    transform: [{ scaleY: bar3.value }],
  }));

  if (!playing) return <PlayIcon color={colors.accent} size={30} />;

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2 }}>
      <Animated.View
        style={[
          {
            width: size / 5,
            height: size,
            backgroundColor: colors.accent,
            borderRadius: 2,
          },
          style1,
        ]}
      />
      <Animated.View
        style={[
          {
            width: size / 5,
            height: size,
            backgroundColor: colors.accent,
            borderRadius: 2,
          },
          style2,
        ]}
      />
      <Animated.View
        style={[
          {
            width: size / 5,
            height: size,
            backgroundColor: colors.accent,
            borderRadius: 2,
          },
          style3,
        ]}
      />
    </View>
  );
};

export default MusicVisualizer;
