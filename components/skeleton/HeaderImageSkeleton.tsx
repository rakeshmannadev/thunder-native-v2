import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { StyleSheet, View } from "react-native";

const HeaderImageSkeleton = () => {
  return (
    <View style={styles.container}>
      <Skeleton className="w-full h-full bg-background-200" />
    </View>
  );
};

export default HeaderImageSkeleton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});
