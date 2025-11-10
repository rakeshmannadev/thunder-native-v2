import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import React from "react";
import { View } from "react-native";

const RenderSkeleton = ({ length }: { length: number }) => {
  return (
    <View className="p-3 w-full">
      {Array.from({ length }, () => 0).map((_, i) => (
        <View key={i} className="flex-row w-full items-start mb-4 gap-3">
          <Skeleton variant="rounded" className="w-20 aspect-square" />
          <View className="w-full pr-5">
            <SkeletonText className="w-10/12 h-5 mb-1" />
            <SkeletonText className="w-40 h-5 mb-1" />
            <SkeletonText className="w-20 h-5" />
          </View>
        </View>
      ))}
    </View>
  );
};

export default RenderSkeleton;
