import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { colors, fontSize, screenPadding } from "@/constants/tokens";
import usePlayerStore from "@/store/usePlayerStore";
import { defaultStyles } from "@/styles";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
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
  const colorScheme = useColorScheme();
  const { top } = useSafeAreaInsets();

  const { currentSong, audioPreference } = usePlayerStore();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            Colors[colorScheme === "light" ? "light" : "dark"].background,
        },
      ]}
    >
      <ScrollView style={[styles.scrollContent, { paddingTop: top + 60 }]}>
        <View style={styles.scrollContent}>
          {/* Appreance section */}
          <View style={styles.sectionContainer}>
            <ThemedText type="subtitle">Appreance</ThemedText>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/menu",
                  params: {
                    items: JSON.stringify([
                      {
                        key: "light",
                        label: "Light",

                        icon: "sun",
                      },
                      {
                        key: "dark",
                        label: "Dark",

                        icon: "moon",
                      },
                    ]),
                  },
                })
              }
              className="w-full flex flex-row justify-between rounded-3xl p-4"
              style={{
                backgroundColor:
                  colorScheme === "dark"
                    ? "rgba(255,255,255,0.25)"
                    : "rgb(201, 201, 201)",
              }}
            >
              <View className="flex flex-row items-center gap-4">
                <FontAwesome
                  name={colorScheme === "dark" ? "moon-o" : "sun-o"}
                  color={colorScheme === "dark" ? "white" : "black"}
                  size={20}
                />
                <ThemedText type="defaultSemiBold">
                  {colorScheme &&
                    colorScheme?.charAt(0).toUpperCase() +
                      colorScheme?.slice(1)}
                </ThemedText>
              </View>

              <ChevronRight
                color={colorScheme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>

          {/* Playback section */}
          <View style={styles.sectionContainer}>
            <ThemedText type="subtitle" darkColor={colors.textMuted}>
              Playback
            </ThemedText>
            {/* Audio preference */}
            <TouchableOpacity
              style={{
                backgroundColor:
                  colorScheme === "dark"
                    ? "rgba(255,255,255,0.25)"
                    : "rgb(201, 201, 201)",
              }}
              onPress={() =>
                router.push({
                  pathname: "/menu",
                  params: {
                    items: JSON.stringify([
                      {
                        key: "download_first",
                        label: "Download first",
                        icon: "download",
                      },
                      {
                        key: "streaming",
                        label: "Streaming",
                        icon: "mug",
                      },
                    ]),
                  },
                })
              }
              className="w-full flex flex-row justify-between rounded-3xl p-4"
            >
              <View className="flex flex-row items-center gap-4">
                <FontAwesome
                  name="cog"
                  color={colorScheme === "dark" ? "white" : "black"}
                  size={20}
                />
                <ThemedText type="defaultSemiBold">
                  {audioPreference.downloadFirst
                    ? "Downlode First"
                    : "Streaming"}{" "}
                </ThemedText>
              </View>

              <ChevronRight
                color={colorScheme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
            {/* Audio quality */}
            <TouchableOpacity
              style={{
                backgroundColor:
                  colorScheme === "dark"
                    ? "rgba(255,255,255,0.25)"
                    : "rgb(201, 201, 201)",
              }}
              onPress={() =>
                router.push({
                  pathname: "/menu",
                  params: {
                    items: JSON.stringify([
                      {
                        key: "low",
                        label: "Low",
                      },
                      {
                        key: "medium",
                        label: "Medium",
                      },
                      {
                        key: "high",
                        label: "High",
                      },
                    ]),
                  },
                })
              }
              className="w-full flex flex-row justify-between rounded-3xl p-4"
            >
              <View className="flex flex-row items-center gap-4">
                <FontAwesome
                  name="headphones"
                  color={colorScheme === "dark" ? "white" : "black"}
                  size={20}
                />
                <ThemedText type="defaultSemiBold">
                  {audioPreference.quality.charAt(0).toUpperCase() +
                    audioPreference.quality.slice(1)}
                </ThemedText>
              </View>

              <ChevronRight
                color={colorScheme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
  },
  sectionContainer: {
    gap: 15,
    marginBottom: 20,
  },
  artworkContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 6,
  },
  artwork: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  title: {
    ...defaultStyles.text,
    fontSize: 22,
    fontWeight: "700",
  },
  artist: {
    ...defaultStyles.text,
    fontSize: fontSize.base,
    opacity: 0.8,
    marginVertical: 6,
  },
  songCount: {
    ...defaultStyles.text,
    fontSize: 14,
    opacity: 0.7,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
