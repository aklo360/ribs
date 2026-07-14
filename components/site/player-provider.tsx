"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { RELEASES, type Release } from "@/lib/content";

const PREVIEW_DURATION_FALLBACK = 30;

type WindowWithWebkitAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

type PlayerContextValue = {
  release: Release;
  releaseIndex: number;
  audioElement: HTMLAudioElement | null;
  analyser: AnalyserNode | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  displayDuration: number;
  progress: number;
  dismissed: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  restart: () => void;
  dismiss: () => void;
  selectRelease: (index: number) => void;
  seekToRatio: (ratio: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

function measuredDuration(audio: HTMLAudioElement) {
  return Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const featuredIndex = useMemo(
    () => Math.max(0, RELEASES.findIndex((r) => r.featured)),
    []
  );
  const [releaseIndex, setReleaseIndex] = useState(featuredIndex);
  const activeReleaseIndex = RELEASES[releaseIndex] ? releaseIndex : featuredIndex;
  const release = RELEASES[activeReleaseIndex] ?? RELEASES[0];
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncTime = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(measuredDuration(audio));
    };
    const syncDuration = () => setDuration(measuredDuration(audio));
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("loadeddata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("canplay", syncDuration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnd);

    syncTime();

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("loadeddata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("canplay", syncDuration);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnd);
    };
  }, [release.previewUrl]);

  const connectAnalyser = () => {
    const audio = audioRef.current;
    if (!audio || !release.previewUrl) return;

    const AudioContextClass =
      window.AudioContext ||
      (window as WindowWithWebkitAudio).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = context;

    if (!sourceRef.current) {
      const source = context.createMediaElementSource(audio);
      const nextAnalyser = context.createAnalyser();
      nextAnalyser.fftSize = 2048;
      nextAnalyser.smoothingTimeConstant = 0.72;
      source.connect(nextAnalyser);
      nextAnalyser.connect(context.destination);
      sourceRef.current = source;
      setAnalyser(nextAnalyser);
    }

    if (context.state === "suspended") {
      context.resume().catch(() => undefined);
    }
  };

  const play = () => {
    const audio = audioRef.current;
    if (!audio || !release.previewUrl) return;
    connectAnalyser();
    setDismissed(false);
    audio.play().catch(() => setPlaying(false));
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  const toggle = () => {
    if (playing) {
      pause();
      return;
    }
    play();
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const dismiss = () => {
    pause();
    setDismissed(true);
  };

  const selectRelease = (index: number) => {
    const nextIndex = (index + RELEASES.length) % RELEASES.length;

    audioRef.current?.pause();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setDismissed(false);
    setReleaseIndex(nextIndex);
  };

  const displayDuration =
    duration || (release.previewUrl ? PREVIEW_DURATION_FALLBACK : 0);

  const seekToRatio = (ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !displayDuration) return;
    const clamped = Math.min(1, Math.max(0, ratio));
    const nextTime = clamped * displayDuration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const value = {
    release,
    releaseIndex: activeReleaseIndex,
    audioElement,
    analyser,
    playing,
    currentTime,
    duration,
    displayDuration,
    progress: displayDuration
      ? Math.min(100, (currentTime / displayDuration) * 100)
      : 0,
    dismissed,
    play,
    pause,
    toggle,
    restart,
    dismiss,
    selectRelease,
    seekToRatio,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {release.previewUrl && (
        <audio
          ref={(node) => {
            audioRef.current = node;
            setAudioElement(node);
          }}
          src={release.previewUrl}
          preload="metadata"
          crossOrigin="anonymous"
        />
      )}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const player = useContext(PlayerContext);
  if (!player) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }
  return player;
}
