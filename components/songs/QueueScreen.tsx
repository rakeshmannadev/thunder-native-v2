import usePlayerStore from "@/store/usePlayerStore";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SCREEN_HEIGHT = 700; // approximate height of your screen
const QUEUE_HEIGHT = 500; // how tall the queue sheet will be

export function QueueScreen() {
  const { queue, currentSong } = usePlayerStore();
  const translateY = useSharedValue(QUEUE_HEIGHT - 80);
  const startY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = Math.max(0, startY.value + e.translationY);
    })
    .onEnd(() => {
      if (translateY.value > QUEUE_HEIGHT / 2) {
        translateY.value = withSpring(QUEUE_HEIGHT - 80); // close
      } else {
        translateY.value = withSpring(0); // open
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: QUEUE_HEIGHT,
            backgroundColor: "#121212",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 16,
            zIndex: 50,
          },
          animatedStyle,
        ]}
      >
        <View
          style={{
            width: 50,
            height: 6,
            backgroundColor: "#666",
            borderRadius: 3,
            alignSelf: "center",
            marginBottom: 12,
          }}
        />
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          🎵 Song Queue
        </Text>

        <FlatList
          data={queue}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => null}
              style={[
                {
                  paddingVertical: 12,
                  borderBottomWidth: 0.5,
                  borderColor: "#444",
                },
                currentSong?._id === item._id && {
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
              ]}
            >
              <Text numberOfLines={1} style={{ fontSize: 10, fontWeight: 500 }}>
                {item.title}
              </Text>
              <Text style={{ color: "#aaa", fontSize: 14, marginTop: 2 }}>
                {item.artists?.primary?.map((a) => a.name).join(", ")}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </GestureDetector>
  );
}
