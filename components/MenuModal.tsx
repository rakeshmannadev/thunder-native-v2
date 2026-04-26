import { ICON_MAPS } from "@/constants/Icons";
import { Colors } from "@/constants/Colors";
import useMenuActions from "@/hooks/useMenuActions";
import React, { useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ChevronRightIcon } from "lucide-react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  data?: any;
  destructive?: boolean;
  submenu?: boolean;
}

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
  title?: string;
}

const MenuModal = ({
  visible,
  onClose,
  items,
  title = "Options",
}: MenuModalProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { handleMenuActions } = useMenuActions();
  const { bottom } = useSafeAreaInsets();

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
        onClose();
      }
    },
    [onClose]
  );

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

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      enableDynamicSizing={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.component }}
      handleIndicatorStyle={{ backgroundColor: colors.text, opacity: 0.2, width: 40 }}
    >
      <BottomSheetView style={[styles.contentContainer, { paddingBottom: bottom || 20 }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>

        <View style={styles.itemsContainer}>
          {items.map((item, index) => {
            const iconName = item?.icon ? item.icon : null;
            const Icon = iconName ? ICON_MAPS[iconName] : null;
            const isDestructive = item?.destructive;

            return (
              <TouchableOpacity
                key={item.key + index}
                style={[
                  styles.itemButton,
                  { borderBottomColor: colors.borderColor },
                  index === items.length - 1 && { borderBottomWidth: 0 },
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  onClose();
                  // Short delay to allow modal to start closing
                  setTimeout(() => {
                    handleMenuActions(item.key, item.data);
                  }, 100);
                }}
              >
                {Icon && (
                  <View
                    style={[
                      styles.iconContainer,
                      isDestructive && { backgroundColor: "rgba(255, 107, 107, 0.1)" },
                    ]}
                  >
                    <Icon
                      size={20}
                      color={isDestructive ? "#ff6b6b" : colors.text}
                    />
                  </View>
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
                  {item.submenu && (
                    <ChevronRightIcon size={20} color={colors.text} style={{ opacity: 0.4 }} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
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
});

export default MenuModal;
