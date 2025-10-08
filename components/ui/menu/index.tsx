import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";

const SCREEN = Dimensions.get("screen");
const DEFAULT_WIDTH = 200;

type ContextMenuProps = {
  trigger: (props: { open: () => void; ref: React.Ref<any> }) => ReactNode;
  children?: ReactNode;
  width?: number;
  offset?: number; // vertical offset between trigger and menu
  placement?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};
let colorScheme;

export function ContextMenu({
  trigger,
  children,
  width = DEFAULT_WIDTH,
  offset = 6,
  placement = "bottom-left",
}: ContextMenuProps) {
  const wrapperRef = useRef<View | null>(null);
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  colorScheme = useColorScheme();

  // Open: measure and show
  const open = () => {
    // measure after layout
    requestAnimationFrame(() => {
      if (wrapperRef.current?.measureInWindow) {
        wrapperRef.current.measureInWindow((x, y, w, h) => {
          // sometimes measure returns zeros if the view is not attached; guard
          if (typeof x !== "number") return;
          setRect({ x, y, w, h });
          setVisible(true);
        });
      } else {
        // fallback: still open but position center-top
        setRect({ x: 8, y: 40, w: 0, h: 0 });
        setVisible(true);
      }
    });
  };

  // Animate when visible changes
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          stiffness: 200,
          damping: 20,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.96,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fade, scale]);

  const close = () => setVisible(false);

  // compute menu position given measured rect and placement
  const computePosition = (): { top: number; left: number } => {
    const menuW = width;
    const { x, y, w, h } = rect;

    // default bottom-left below trigger
    let left = x;
    let top = y + h + offset;

    if (placement === "bottom-left") {
      left = Math.max(8, Math.min(x, SCREEN.width - menuW - 8));
    } else if (placement === "bottom-right") {
      left = Math.max(8, Math.min(x + w - menuW, SCREEN.width - menuW - 8));
    } else if (placement === "top-left") {
      left = Math.max(8, Math.min(x, SCREEN.width - menuW - 8));
      top = y - offset - 8 - 200; // fallback upward; we will clamp below
    } else if (placement === "top-right") {
      left = Math.max(8, Math.min(x + w - menuW, SCREEN.width - menuW - 8));
      top = y - offset - 8 - 200;
    }

    // clamp top if necessary (ensure visible)
    if (top + 48 > SCREEN.height) top = Math.max(8, SCREEN.height - 48 - menuW);
    if (top < 8) top = Math.max(8, y + h + offset);

    return { top, left };
  };

  const pos = computePosition();

  return (
    <>
      {/* wrapper with ref — important: collapsable false so RN doesn't optimize away on Android */}
      <View ref={wrapperRef} collapsable={false}>
        {trigger({ open, ref: wrapperRef })}
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={close}
      >
        {/* Backdrop: close on press */}
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Popup */}
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.popup,
            {
              width,
              top: pos.top,
              left: pos.left,
              opacity: fade,
              transform: [{ scale }],
            } as ViewStyle,
          ]}
        >
          <View style={styles.inner}>{children}</View>
        </Animated.View>
      </Modal>
    </>
  );
}

type ContextMenuItemProps = {
  onPress?: () => void;
  children?: ReactNode;
  destructive?: boolean;
};

export function ContextMenuItem({
  onPress,
  children,
  destructive,
}: ContextMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "rgba(255,255,255,0.06)" }}
      style={({ pressed }) => [
        styles.item,
        pressed && { backgroundColor: "rgba(255,255,255,0.03)" },
      ]}
    >
      <Text style={[styles.itemText, destructive && { color: "#ff6b6b" }]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  popup: {
    position: "absolute",
    borderRadius: 10,
    backgroundColor: "#151718",
    elevation: 16,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    overflow: "hidden",
  },
  inner: {
    padding: 8,
    gap: 10,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  itemText: {
    color: "#fff",
    fontSize: 15,
  },
});
