import { Colors } from "@/constants/Colors";
import { Featured } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "../ThemedText";
import Animated, { FadeInDown } from "react-native-reanimated";

type FeaturedCardProps = {
  featured: Featured;
  isLoading?: boolean;
};

const FeaturedCard = React.memo(
  ({ featured, isLoading = false }: FeaturedCardProps) => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === "light" ? "light" : "dark"];

    const handlePress = () => {
      if (featured?.type === "playlist") {
        router.push({
          pathname: "/playlist/[id]",
          params: { id: featured.id },
        });
      }
    };

    if (isLoading) {
      return (
        <View style={styles.skeletonContainer}>
          <Skeleton className="w-full h-full rounded-3xl" />
          <View style={styles.skeletonTextWrapper}>
            <SkeletonText className="w-32 h-6 mb-2" />
            <SkeletonText className="w-24 h-4" />
          </View>
        </View>
      );
    }

    return (
      <Animated.View entering={FadeInDown.duration(600)}>
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={handlePress}
          style={styles.container}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: featured?.image }}
              style={styles.image}
              alt={featured?.name}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.9)"]}
              style={styles.gradient}
            />
          </View>

          <View style={styles.content}>
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <ThemedText style={styles.badgeText}>FEATURED</ThemedText>
            </View>
            <ThemedText style={styles.name} numberOfLines={1}>
              {featured?.name}
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: 'rgba(255,255,255,0.7)' }]} numberOfLines={1}>
              {featured?.subtitle}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: 240, // Wider than regular cards to feel 'featured'
    height: 180,
    marginRight: 20,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  skeletonContainer: {
    width: 240,
    height: 180,
    marginRight: 20,
    borderRadius: 32,
    overflow: "hidden",
  },
  skeletonTextWrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "white",
    letterSpacing: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "white",
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default FeaturedCard;
