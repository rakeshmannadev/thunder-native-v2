import { ICON_MAPS } from "@/constants/Icons";
import { Colors } from "@/constants/Colors";
import useMenuActions from "@/hooks/useMenuActions";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ChevronRightIcon } from "lucide-react-native";

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
  title = "Song Options",
}: MenuModalProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { handleMenuActions } = useMenuActions();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.content, { backgroundColor: colors.component }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

          {items.map((item, index) => {
            const iconName = item?.icon ? item.icon : null;
            const Icon = iconName ? ICON_MAPS[iconName] : null;

            return (
              <TouchableOpacity
                key={item.key + index}
                activeOpacity={0.7}
                onPress={() => {
                  onClose();
                  handleMenuActions(item.key, item.data);
                }}
              >
                <View
                  style={[
                    styles.item,
                    { borderBottomColor: colors.borderColor },
                  ]}
                >
                  {Icon && (
                    <Icon
                      size={20}
                      color={
                        item?.destructive
                          ? "#ff6b6b"
                          : colors.text
                      }
                    />
                  )}
                  <View style={styles.itemContent}>
                    <Text
                      style={[
                        styles.itemText,
                        { color: item?.destructive ? "#ff6b6b" : colors.text },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.submenu && (
                      <ChevronRightIcon size={20} color={colors.text} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default MenuModal;
