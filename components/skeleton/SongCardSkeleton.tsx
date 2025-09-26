import React from "react";
import { Box } from "../ui/box";
import { Skeleton, SkeletonText } from "../ui/skeleton";

const SongCardSkeleton = () => {
  return (
    <Box className="w-36 gap-2 p-3 rounded-lg bg-background-100">
      <Skeleton variant="rounded" className="h-[100px]" />
      <SkeletonText _lines={2} className="h-2" />
    </Box>
  );
};

export default SongCardSkeleton;
