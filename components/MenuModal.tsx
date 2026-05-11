import { Colors } from "@/constants/Colors";
import { ICON_MAPS } from "@/constants/Icons";
import useMenuActions from "@/hooks/useMenuActions";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  imageUrl?: string;
  data?: any;
  destructive?: boolean;
  submenu?: MenuItem[];
}

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
  title?: string;
  imageUrl?: string;
  description?: string;
}

const MenuModal = ({
  visible,
  onClose,
  items,
  title = "Options",
  imageUrl,
  description,
}: MenuModalProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { handleMenuActions } = useMenuActions();
  const { bottom } = useSafeAreaInsets();

  // Submenu state
  const [activeSubmenu, setActiveSubmenu] = useState<MenuItem[] | null>(null);
  const [submenuTitle, setSubmenuTitle] = useState<string>("");
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        // Reset submenu when sheet is dismissed
        setActiveSubmenu(null);
        setSubmenuTitle("");
        slideAnim.setValue(0);
        onClose();
      }
    },
    [onClose, slideAnim]
  );

  const openSubmenu = useCallback(
    (submenuItems: MenuItem[], parentLabel: string) => {
      setActiveSubmenu(submenuItems);
      setSubmenuTitle(parentLabel);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
    [slideAnim]
  );

  const closeSubmenu = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setActiveSubmenu(null);
      setSubmenuTitle("");
    });
  }, [slideAnim]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
      />
    ),
    []
  );

  const renderMenuItems = (menuItems: MenuItem[], isSubmenu: boolean) => {
    return menuItems.map((item, index) => {
      const iconName = item?.icon ? item.icon : null;
      const Icon = iconName ? ICON_MAPS[iconName] : null;
      const isDestructive = item?.destructive;
      const hasSubmenu = item.submenu && item.submenu.length > 0;

      return (
        <TouchableOpacity
          key={item.key + index}
          style={[
            styles.itemButton,
            { borderBottomColor: colors.borderColor },
            index === menuItems.length - 1 && { borderBottomWidth: 0 },
          ]}
          activeOpacity={0.7}
          onPress={() => {
            if (hasSubmenu) {
              openSubmenu(item.submenu!, item.label);
            } else {
              onClose();
              // Short delay to allow modal to start closing
              setTimeout(() => {
                handleMenuActions(item.key, item.data);
              }, 100);
            }
          }}
        >
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
          ) : (
            Icon && (
              <View
                style={[
                  styles.iconContainer,
                  isDestructive && {
                    backgroundColor: "rgba(255, 107, 107, 0.1)",
                  },
                ]}
              >
                <Icon
                  size={20}
                  color={isDestructive ? "#ff6b6b" : colors.text}
                />
              </View>
            )
          )}

          <View style={styles.itemContent}>
            <Text
              style={[
                styles.itemText,
                { color: isDestructive ? "#ff6b6b" : colors.text },
              ]}
            >
              {item.label}
            </Text>
            {hasSubmenu && <ChevronRightIcon size={20} color={colors.text} />}
          </View>
        </TouchableOpacity>
      );
    });
  };

  // Slide animations
  const mainTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -300],
  });

  const mainOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const submenuTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const submenuOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      enableDynamicSizing={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.component }}
      handleIndicatorStyle={{
        backgroundColor: colors.text,
        opacity: 0.2,
        width: 40,
      }}
    >
      <BottomSheetView
        style={[styles.contentContainer, { paddingBottom: bottom || 20 }]}
      >
        {/* Main menu */}
        <Animated.View
          style={{
            transform: [{ translateX: mainTranslateX }],
            opacity: mainOpacity,
            display: activeSubmenu ? "flex" : "flex",
          }}
          pointerEvents={activeSubmenu ? "none" : "auto"}
        >
          {imageUrl ? (
            <View style={styles.songInfoHeader}>
              <Image source={{ uri: imageUrl }} style={styles.songImage} />
              <View style={styles.songInfoText}>
                <Text
                  style={[styles.songTitle, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                {description ? (
                  <Text
                    style={[
                      styles.songDescription,
                      { color: colors.textMuted },
                    ]}
                    numberOfLines={1}
                  >
                    {description}
                  </Text>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                {title}
              </Text>
            </View>
          )}
          <View style={styles.itemsContainer}>
            {renderMenuItems(items, false)}
          </View>
        </Animated.View>

        {/* Submenu overlay */}
        {activeSubmenu && (
          <Animated.View
            style={[
              styles.submenuOverlay,
              {
                transform: [{ translateX: submenuTranslateX }],
                opacity: submenuOpacity,
              },
            ]}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={closeSubmenu}
                activeOpacity={0.7}
              >
                <ChevronLeftIcon size={22} color={colors.text} />
                <Text style={[styles.backText, { color: colors.text }]}>
                  Back
                </Text>
              </TouchableOpacity>
              <Text style={[styles.title, { color: colors.text }]}>
                {submenuTitle}
              </Text>
              {/* Spacer to center the title */}
              <View style={styles.backButton} />
            </View>
            <View style={styles.itemsContainer}>
              {renderMenuItems(activeSubmenu, true)}
            </View>
          </Animated.View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
    flex: 1,
    textAlign: "center",
  },
  itemsContainer: {
    flexDirection: "column",
  },
  itemButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(150, 150, 150, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(150, 150, 150, 0.1)",
  },
  submenuOverlay: {
    position: "absolute",
    top: 10,
    left: 20,
    right: 20,
    bottom: 0,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minWidth: 60,
  },
  backText: {
    fontSize: 15,
    fontWeight: "500",
  },
  songInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(150, 150, 150, 0.15)",
  },
  songImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "rgba(150, 150, 150, 0.1)",
  },
  songInfoText: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  songDescription: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.8,
  },
});

export default MenuModal;
