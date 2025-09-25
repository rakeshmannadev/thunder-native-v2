import { useCallback, useEffect, useState } from "react";

export const useTrackPlayerRepeatMode = () => {
  const [repeatMode, setRepeatMode] = useState();

  const changeRepeatMode = useCallback(async () => {
    // await TrackPlayer.setRepeatMode(repeatMode);

    setRepeatMode(repeatMode);
  }, []);

  useEffect(() => {}, []);

  return { repeatMode, changeRepeatMode };
};
