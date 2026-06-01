import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { EaseView } from "react-native-ease";

export type MovingTextProps = {
  text: string;
  animationThreshold: number;
  style: any;
  maskColor?: string;
};

export const MovingText = React.memo(
  ({ text, animationThreshold, style, maskColor }: MovingTextProps) => {
    const shouldAnimate = text.length >= animationThreshold;
    const textWidth = text.length * 3;

    return (
      <View style={{ overflow: "hidden", width: "100%", flexDirection: "row" }}>
        {shouldAnimate ? (
          // Use initialAnimate → animate (enter animation) so the native engine
          // applies loop: 'reverse' correctly — this is the only path that enables
          // looping in react-native-ease's Android/iOS implementation.
          <EaseView
            key={text} // re-trigger enter animation when text changes
            initialAnimate={{ translateX: 0 }}
            animate={{ translateX: -textWidth }}
            transition={{
              type: "timing",
              duration: 5000,
              easing: "linear",
              delay: 1000,
              loop: "reverse",
            }}
            style={{ width: 9999, paddingLeft: 16 }}
          >
            <Text numberOfLines={1} style={style}>
              {text}
            </Text>
          </EaseView>
        ) : (
          <Text numberOfLines={1} style={style}>
            {text}
          </Text>
        )}

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
