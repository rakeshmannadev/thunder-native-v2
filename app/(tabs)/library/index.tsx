import EmptyLibrary from "@/components/EmptyLibrary";
import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, screenPadding } from "@/constants/tokens";
import useUserStore from "@/store/useUserStore";
import { defaultStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ChevronRightIcon, PlusIcon } from "lucide-react-native";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const index = () => {
  const router = useRouter();

  const { currentUser, fetchPlaylists, getFavoriteSongs } = useUserStore();

  useEffect(() => {
    if (currentUser) {
      fetchPlaylists();
      getFavoriteSongs();
    }
  }, []);

  const colorSchema = useColorScheme();
  const { top, bottom } = useSafeAreaInsets();
  const colors = Colors[colorSchema === "dark" ? "dark" : "light"];

  if (!currentUser) return <EmptyLibrary />;
  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: colors.background,
        },
        styles.container,
      ]}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginTop: top + 60, gap: 16, flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            pressRetentionOffset={12}
            onPress={() =>
              router.push({
                pathname: "/library_content",
                params: { pagename: "liked" },
              })
            }
            style={styles.sectionContiner}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={[styles.card, { backgroundColor: colors.component }]}
              >
                <Ionicons
                  name={"heart-outline"}
                  size={fontSize.lg}
                  color={colors.icon}
                />
              </View>
              <View>
                <ThemedText type="subtitle">{`Liked Songs`}</ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  darkColor={colors.textMuted}
                  lightColor={colors.textMuted}
                >
                  20 Songs
                </ThemedText>
              </View>
            </View>
            <ChevronRightIcon size={fontSize.lg} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            pressRetentionOffset={12}
            onPress={() =>
              router.push({
                pathname: "/library_content",
                params: { pagename: "playlists" },
              })
            }
            style={styles.sectionContiner}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                height: "100%",
              }}
            >
              <View
                style={[styles.card, { backgroundColor: colors.component }]}
              >
                <Ionicons
                  name={"list-outline"}
                  size={fontSize.lg}
                  color={colors.icon}
                />
              </View>
              <View style={{ alignContent: "flex-start" }}>
                <ThemedText type="subtitle">My Playlists</ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  darkColor={colors.textMuted}
                  lightColor={colors.textMuted}
                >
                  20 Songs
                </ThemedText>
              </View>
            </View>
            <ChevronRightIcon size={fontSize.lg} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            pressRetentionOffset={12}
            onPress={() =>
              router.push({
                pathname: "/library_content",
                params: { pagename: "albums" },
              })
            }
            style={styles.sectionContiner}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={[styles.card, { backgroundColor: colors.component }]}
              >
                <Ionicons
                  name={"albums-outline"}
                  size={fontSize.lg}
                  color={colors.icon}
                />
              </View>
              <View>
                <ThemedText type="subtitle">Saved Albums</ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  darkColor={colors.textMuted}
                  lightColor={colors.textMuted}
                >
                  20 Songs
                </ThemedText>
              </View>
            </View>
            <ChevronRightIcon size={fontSize.lg} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            pressRetentionOffset={12}
            onPress={() =>
              router.push({
                pathname: "/library_content",
                params: { pagename: "downloads" },
              })
            }
            style={styles.sectionContiner}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={[styles.card, { backgroundColor: colors.component }]}
              >
                <Ionicons
                  name={"download-outline"}
                  size={fontSize.lg}
                  color={colors.icon}
                />
              </View>
              <View>
                <ThemedText type="subtitle"> Downloads</ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  darkColor={colors.textMuted}
                  lightColor={colors.textMuted}
                >
                  20 Songs
                </ThemedText>
              </View>
            </View>
            <ChevronRightIcon size={fontSize.lg} color={colors.text} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Button
        variant="solid"
        size="xl"
        action="secondary"
        className="w-full  "
        style={{
          borderRadius: borderRadius.md,
          backgroundColor: colors.accent,
          marginBottom: bottom,
        }}
      >
        <ButtonIcon color={colors.text} size={"xl"} as={PlusIcon} />
        <ButtonText style={{ color: colors.text }} size="xl">
          Create Playlist
        </ButtonText>
      </Button>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    ...defaultStyles.container,

    paddingHorizontal: screenPadding.horizontal,
  },
  sectionContiner: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
    width: "100%",
    alignItems: "center",
  },
  card: {
    height: 56,
    width: 56,
    flexShrink: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.sm,
    marginBottom: 10,
    gap: 8,
  },
});
