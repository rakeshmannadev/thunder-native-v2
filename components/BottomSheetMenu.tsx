import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const SHEET_HEIGHT = 300;

type BottomSheetMenuProps = {
  visible: boolean;
  onClose: () => void;
  items: { label: string; onPress: () => void; destructive?: boolean }[];
};

export default function BottomSheetMenu({
  visible,
  onClose,
  items,
}: BottomSheetMenuProps) {
  const translateY = useSharedValue(SHEET_HEIGHT);

  React.useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { stiffness: 260, damping: 80 });
    } else {
      translateY.value = withSpring(SHEET_HEIGHT, {
        stiffness: 260,
        damping: 80,
      });
    }
  }, [visible]);

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onUpdate((e) => {
        translateY.value = Math.max(0, e.translationY);
      })
      .onEnd(() => {
        if (translateY.value > 100) {
          translateY.value = withSpring(
            SHEET_HEIGHT,
            { stiffness: 160, damping: 20 },
            () => {
              scheduleOnRN(onClose);
            }
          );
        } else {
          translateY.value = withSpring(0, {
            stiffness: 200,
            damping: 80,
          });
        }
      });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.backdrop} onTouchEnd={onClose}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheet, animatedStyle]}>
          <View style={styles.dragHandle} />

          {items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                item.onPress();
                onClose();
              }}
            >
              <Text
                style={[
                  styles.menuText,
                  item.destructive && { color: "#ff6b6b" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: "#1c1c1e",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#555",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 12,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
  },
});
