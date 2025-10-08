// components/MusicVisualizer.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  playing?: boolean;
  size?: number;
  color?: string;
};

const MusicVisualizer = ({
  playing = true,
  size = 20,
  color = "#1DB954",
}: Props) => {
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

  if (!playing) return null;

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2 }}>
      <Animated.View
        style={[
          {
            width: size / 5,
            height: size,
            backgroundColor: color,
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
            backgroundColor: color,
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
            backgroundColor: color,
            borderRadius: 2,
          },
          style3,
        ]}
      />
    </View>
  );
};

export default MusicVisualizer;
