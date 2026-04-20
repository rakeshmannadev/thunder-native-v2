import usePlayerStore from "@/store/usePlayerStore";
import useSocketStore from "@/store/useSocketStore";
import TrackPlayer, { Event, State, useTrackPlayerEvents } from "react-native-track-player";
import { useEffect } from "react";

/**
 * useTrackPlayerSync
 *
 * Bridges Zustand's currentSong queue to RNTP with no provider wrapper needed.
 * Call this once at the root layout level (alongside useSetupTrackPlayer).
 *
 * Handles:
 *  1. currentSong change → load track into RNTP + auto-play
 *  2. Socket broadcasting → seek + play/pause sync
 *  3. Track end → loop / next / stop
 */
export const useTrackPlayerSync = () => {
  const currentSongId = usePlayerStore(
    (s) => s.currentSong?.songId ?? s.currentSong?._id
  );
  const currentSong = usePlayerStore((s) => s.currentSong);
  const { playNext, hasNext, loop } = usePlayerStore();
  const { isBroadcasting, isPlayingSong, currentTime } = useSocketStore();

  // ─── 1. Load new track whenever currentSong changes ───────────────────────
  useEffect(() => {
    if (!currentSong) return;

    const loadTrack = async () => {
      try {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: currentSong.songId ?? currentSong._id,
          url: currentSong.audioUrl,
          title: currentSong.title,
          artist: currentSong.artists?.primary?.map((a) => a.name).join(", ") ?? "",
          artwork: currentSong.imageUrl,
          album: currentSong.albumId,
        });
        await TrackPlayer.play();
      } catch (err) {
        console.error("[useTrackPlayerSync] Failed to load track:", err);
      }
    };

    loadTrack();
  }, [currentSongId]);

  // ─── 2. Broadcasting sync: seek + play/pause from socket ──────────────────
  useEffect(() => {
    if (!isBroadcasting) return;

    const sync = async () => {
      try {
        const progress = await TrackPlayer.getProgress();
        if (Math.abs(progress.position - currentTime) > 0.5) {
          await TrackPlayer.seekTo(currentTime);
        }
      } catch {}

      if (isPlayingSong) {
        TrackPlayer.play();
      } else {
        TrackPlayer.pause();
      }
    };

    sync();
  }, [isBroadcasting, isPlayingSong, currentTime]);

  // ─── 3. Track end: loop / next / stop ─────────────────────────────────────
  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.state !== State.Ended) return;

    if (loop === "one") {
      await TrackPlayer.seekTo(0);
      TrackPlayer.play();
      return;
    }

    if (hasNext()) {
      playNext(); // currentSong changes → useEffect 1 fires → loads next track
    } else if (loop === "all") {
      playNext();
    }
    // loop === "off" and no next: RNTP already stopped; useIsPlaying() reflects it
  });
};
