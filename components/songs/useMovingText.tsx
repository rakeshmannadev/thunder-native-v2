import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export type MovingTextProps = {
  text: string;
  animationThreshold: number;
  style: any;
  maskColor?: string;
};

export const MovingText = React.memo(
  ({ text, animationThreshold, style, maskColor }: MovingTextProps) => {
    const translateX = useSharedValue(0);
    const shouldAnimate = text.length >= animationThreshold;

    const textWidth = text.length * 3;

    useEffect(() => {
      if (!shouldAnimate) return;

      translateX.value = withDelay(
        1000,
        withRepeat(
          withTiming(-textWidth, {
            duration: 5000,
            easing: Easing.linear,
          }),
          -1,
          true
        )
      );

      return () => {
        cancelAnimation(translateX);
      };
    }, [translateX, text, animationThreshold, shouldAnimate, textWidth]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: translateX.value }],
      };
    });

    return (
      <View style={{ overflow: "hidden", width: "100%", flexDirection: "row" }}>
        <Animated.Text
          numberOfLines={1}
          style={[
            style,
            shouldAnimate && animatedStyle,
            shouldAnimate && {
              width: 9999,
              paddingLeft: 16,
            },
          ]}
        >
          {text}
        </Animated.Text>

        {shouldAnimate && maskColor && (
          <LinearGradient
            colors={["transparent", maskColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 32,
            }}
          />
        )}
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.text === nextProps.text &&
      prevProps.animationThreshold === nextProps.animationThreshold &&
      prevProps.maskColor === nextProps.maskColor
    );
  }
);
