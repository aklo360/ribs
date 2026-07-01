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

type WindowWithWebkitAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

type PlayerContextValue = {
  release: Release;
  audioElement: HTMLAudioElement | null;
  analyser: AnalyserNode | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  dismissed: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  dismiss: () => void;
  seekToRatio: (ratio: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const release = useMemo(
    () => RELEASES.find((r) => r.featured) ?? RELEASES[0],
    []
  );
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

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
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

  const dismiss = () => {
    pause();
    setDismissed(true);
  };

  const seekToRatio = (ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const clamped = Math.min(1, Math.max(0, ratio));
    audio.currentTime = clamped * duration;
  };

  const value = {
    release,
    audioElement,
    analyser,
    playing,
    currentTime,
    duration,
    progress: duration ? (currentTime / duration) * 100 : 0,
    dismissed,
    play,
    pause,
    toggle,
    dismiss,
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
          preload="none"
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
