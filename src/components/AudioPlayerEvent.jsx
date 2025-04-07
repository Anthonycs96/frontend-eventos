"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Volume2, VolumeX, XCircle } from "lucide-react";

export default function AudioPlayerEvent({ songUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(true);
  const [player, setPlayer] = useState(null);
  const [playerState, setPlayerState] = useState({
    isLoading: true,
    error: null,
    volume: 50,
  });

  const getYouTubeVideoId = useCallback((url) => {
    if (!url) return null;
    try {
      const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[7].length === 11 ? match[7] : null;
    } catch (error) {
      console.error("Error al extraer ID del video:", error);
      return null;
    }
  }, []);

  const youtubeEmbedUrl = useMemo(() => {
    const videoId = songUrl ? getYouTubeVideoId(songUrl) : null;
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&playsinline=1&controls=0&modestbranding=1&rel=0`;
  }, [songUrl, getYouTubeVideoId]);

  useEffect(() => {
    if (!youtubeEmbedUrl) return;

    const loadYouTubeAPI = () => {
      return new Promise((resolve, reject) => {
        if (window.YT) {
          resolve(window.YT);
          return;
        }

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.onload = () => {
          window.onYouTubeIframeAPIReady = () => {
            resolve(window.YT);
          };
        };
        tag.onerror = (error) => {
          setPlayerState((prev) => ({
            ...prev,
            error: "Error al cargar el reproductor de música",
            isLoading: false,
          }));
          reject(error);
        };
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      });
    };

    loadYouTubeAPI()
      .then((YT) => {
        const newPlayer = new YT.Player("youtube-player", {
          videoId: getYouTubeVideoId(songUrl),
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            loop: 1,
          },
          events: {
            onReady: (event) => {
              setPlayer(event.target);
              setPlayerState((prev) => ({
                ...prev,
                isLoading: false,
              }));
              event.target.setVolume(50);
            },
            onError: (error) => {
              console.error("Error en el reproductor:", error);
              setPlayerState((prev) => ({
                ...prev,
                error: "Error al reproducir la música",
                isLoading: false,
              }));
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.ENDED) {
                event.target.playVideo();
              }
            },
          },
        });
      })
      .catch(console.error);

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [youtubeEmbedUrl, songUrl, getYouTubeVideoId]);

  const startMusic = useCallback(() => {
    if (player && player.playVideo) {
      player.setVolume(0);
      player.playVideo();

      let volume = 0;
      const fadeInterval = setInterval(() => {
        if (volume < playerState.volume) {
          volume += 2;
          player.setVolume(volume);
        } else {
          clearInterval(fadeInterval);
        }
      }, 100);

      setIsPlaying(true);
    }
  }, [player, playerState.volume]);

  const pauseMusic = useCallback(() => {
    if (player) {
      const currentVolume = player.getVolume();
      let volume = currentVolume;

      const fadeInterval = setInterval(() => {
        if (volume > 0) {
          volume -= 2;
          player.setVolume(volume);
        } else {
          clearInterval(fadeInterval);
          player.pauseVideo();
        }
      }, 100);

      setIsPlaying(false);
    }
  }, [player]);

  const toggleMusic = useCallback(() => {
    if (player) {
      if (isPlaying) {
        pauseMusic();
      } else {
        startMusic();
      }
    }
  }, [isPlaying, player, pauseMusic, startMusic]);

  // Manejar la interacción inicial del usuario
  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted && player && !isPlaying && !playerState.error) {
      setHasInteracted(true);
      setShowPlayHint(false);
      startMusic();
    }
  }, [hasInteracted, player, isPlaying, playerState.error, startMusic]);

  useEffect(() => {
    if (!hasInteracted) {
      const handleInteraction = (e) => {
        if (e.target.closest(".music-control-button")) return;
        handleFirstInteraction();
      };

      document.addEventListener("click", handleInteraction);
      document.addEventListener("touchstart", handleFirstInteraction);

      return () => {
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
      };
    }
  }, [hasInteracted, handleFirstInteraction]);

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMusic();
          }}
          disabled={playerState.isLoading || playerState.error}
          className={`music-control-button w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg border border-gold/20
                        ${
                          playerState.isLoading || playerState.error
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-white hover:scale-105 transition-all duration-300"
                        }`}
        >
          {playerState.isLoading ? (
            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          ) : playerState.error ? (
            <XCircle className="text-red-500" size={24} />
          ) : isPlaying ? (
            <Volume2 className="text-gold" size={24} />
          ) : (
            <VolumeX className="text-gold" size={24} />
          )}
        </button>
      </div>

      {showPlayHint &&
        !hasInteracted &&
        !playerState.isLoading &&
        !playerState.error && (
          <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
            <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full text-white flex items-center gap-2 animate-pulse">
              <Volume2 size={20} />
              <span className="text-sm font-medium">
                Toca para reproducir música
              </span>
            </div>
          </div>
        )}

      {youtubeEmbedUrl && (
        <div className="hidden">
          <iframe
            id="youtube-player"
            src={youtubeEmbedUrl}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ display: "none" }}
          />
        </div>
      )}
    </>
  );
}
