"use client";

import Image from "next/image";
import {
  Calendar,
  MapPin,
  Gift,
  Clock,
  Volume2,
  VolumeX,
  Heart,
  XCircle,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import HeaderInvitacion from "@/components/HeaderInvitacion";
import ContadorRegresivo from "@/components/ContadorRegresivo";
import ConfirmacionForm from "@/components/ConfirmacionForm";
import ListaRegalos from "@/components/ListaRegalos";
import { ImprovedCarousel } from "@/components/ui/SimpleCarousel";

export default function TarjetaInvitation({
  evento,
  numberOfGuests,
  invitado,
  fontClass,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(true);
  const [startY, setStartY] = useState(null);
  const [endY, setEndY] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [player, setPlayer] = useState(null);
  const [playerState, setPlayerState] = useState({
    isLoading: true,
    error: null,
    volume: 50,
  });
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAbiertoRegalos, setModalAbiertoRegalos] = useState(false);

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
    const videoId = evento?.songUrl ? getYouTubeVideoId(evento.songUrl) : null;
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&playsinline=1&controls=0&modestbranding=1&rel=0`;
  }, [evento?.songUrl, getYouTubeVideoId]);

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
          videoId: getYouTubeVideoId(evento.songUrl),
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
                event.target.playVideo(); // Reproducir en bucle
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
  }, [youtubeEmbedUrl, evento?.songUrl, getYouTubeVideoId]);

  const handleVolumeChange = useCallback(
    (newVolume) => {
      if (player) {
        player.setVolume(newVolume);
        setPlayerState((prev) => ({
          ...prev,
          volume: newVolume,
        }));
      }
    },
    [player]
  );

  const startMusic = useCallback(() => {
    if (player && player.playVideo) {
      player.setVolume(0);
      player.playVideo();

      // Fade in del volumen
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

      // Fade out del volumen
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

  console.log("hey aca:", invitado.status);

  const abrirModal = () => {
    setModalAbierto(!modalAbierto);
  };
  const abrirModalRegalos = () => setModalAbiertoRegalos(true);
  const cerrarModal = () => setModalAbierto(false);
  const cerrarModalRegalos = () => setModalAbiertoRegalos(false);

  const abrirGoogleMaps = () => {
    const direccion = evento.location || "Ubicación no disponible";
    const url = `https://www.google.com/maps?q=${encodeURIComponent(
      direccion
    )}`;
    window.open(url, "_blank");
  };

  // Manejar la interacción inicial del usuario
  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted && player && !isPlaying && !playerState.error) {
      setHasInteracted(true);
      setShowPlayHint(false);
      startMusic();
    }
  }, [hasInteracted, player, isPlaying, playerState.error, startMusic]);

  // Efecto para manejar eventos de interacción
  useEffect(() => {
    if (!hasInteracted) {
      const handleInteraction = (e) => {
        // No activar si el clic fue en el botón de control de música
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

  // Mostrar el hint de reproducción
  useEffect(() => {
    if (
      showPlayHint &&
      !hasInteracted &&
      !playerState.isLoading &&
      !playerState.error
    ) {
      const timer = setTimeout(() => {
        setShowPlayHint(false);
      }, 5000); // Ocultar después de 5 segundos

      return () => clearTimeout(timer);
    }
  }, [showPlayHint, hasInteracted, playerState.isLoading, playerState.error]);

  if (!evento) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-md mx-auto p-6 text-center">
        <p className="text-gray-600">Cargando datos del evento...</p>
      </div>
    );
  }

  const imageUrl = evento.imageUrl?.startsWith("http")
    ? evento.imageUrl
    : "https://via.placeholder.com/600x300?text=Evento";
  const { name, date, time, location } = evento;

  const fechaObj = new Date(date);
  const dia = fechaObj.toLocaleDateString("es-ES", { day: "2-digit" });
  const mes = fechaObj
    .toLocaleDateString("es-ES", { month: "short" })
    .toUpperCase();
  const anio = fechaObj.getFullYear();

  return (
    <>
      <div className="max-w w-full bg-white rounded-lg overflow-hidden shadow-lg border border-gold/20">
        {/* Control de música con estado de carga y error */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMusic();
            }}
            disabled={playerState.isLoading || playerState.error}
            className={`music-control-button w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md 
                            ${playerState.isLoading || playerState.error
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white/90"
              }`}
          >
            {playerState.isLoading ? (
              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            ) : playerState.error ? (
              <XCircle className="text-red-500" size={20} />
            ) : isPlaying ? (
              <Volume2 className="text-gold" size={20} />
            ) : (
              <VolumeX className="text-gold" size={20} />
            )}
          </button>
        </div>

        {/* Indicador de toque para reproducir música */}
        {showPlayHint &&
          !hasInteracted &&
          !playerState.isLoading &&
          !playerState.error && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full text-white flex items-center gap-2 animate-pulse">
                <Volume2 size={20} />
                <span className="text-sm font-medium">
                  Toca para reproducir música
                </span>
              </div>
            </div>
          )}

        {/* Área táctil para reproducir música */}
        <div
          className={`absolute inset-0 z-10 ${hasInteracted ? "hidden" : ""}`}
          onClick={handleFirstInteraction}
          onTouchStart={handleFirstInteraction}
        ></div>

        {/* Reproductor de YouTube embebido optimizado */}
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

        <div
          className="relative overflow-hidden max-w-lg mx-auto transform transition duration-500 from-black/0 via-black/20 to-black/0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${imageUrl || "/placeholder.svg"})`,
          }}
        >
          {/* Overlay para mejor contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-black/10 pointer-events-none md:hidden"></div>

          {/* Frase principal */}
          <div className="text-center p-6 space-y-4 ">
            <div className="relative">
              <p
                className={`text-5xl sm:text-7xl lg:text-5xl font-bold text-gold drop-shadow-[2px_2px_4px_rgba(139, 101, 23, 0.7)] mb-2 ${fontClass}`}
              >
                {evento.description}
              </p>
            </div>

            {/* Ilustración floral */}
            <div className="flex justify-center py-2">
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25 10C25 10 30 20 40 25C30 30 25 40 25 40C25 40 20 30 10 25C20 20 25 10 25 10Z"
                  stroke="#D4AF37"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Cita bíblica */}
            <div className="space-y-2 px-6">
              <p className="text-oliveAccent text-sm italic">
                "El amor nos une y la familia nos fortalece. Nada nos haría más
                felices que compartir nuestra alegría con quienes más queremos."
              </p>
              <p className="text-gold text-sm">Romanos 12:10</p>
            </div>
          </div>

          {/* Nombres de los novios */}
          <div className="text-center py-4 bg-champagne/30 items-center flex flex-col ">
            <div className="w-16 h-1 bg-amber-300 mb-4 rounded-full"></div>
            <h1
              className={`${fontClass} text-gold text-5xl drop-shadow-[2px_2px_4px_rgba(139, 101, 23, 0.7)] mb-5 `}
            >
              {evento.name}
            </h1>
            <div className="w-16 h-1 bg-amber-300 mb-4 rounded-full"></div>
          </div>

          {/* Detalles de la ceremonia */}
          <div className="text-center p-6 space-y-2 ">
            {/* <p className="text-oliveAccent text-sm">
                    Convidamos você para um chartreado em celebração ao nosso casamento
                </p> */}
            {/* Header section */}
            <div className="block sm:hidden">
              <HeaderInvitacion invitado={invitado} />
            </div>
            {/* Fecha y hora */}
            <div className="flex justify-center items-center gap-8 my-8">
              <div className="text-center p-4 bg-champagne/30 rounded-lg border border-gold/20">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-gold" />
                <p className="text-5xl font-bold text-oliveAccent">{dia}</p>
                <p className="text-xl font-medium text-gold">{mes}</p>
                <p className="text-xl text-oliveAccent">{anio}</p>
              </div>
              <div className="text-center p-4 bg-champagne/30 rounded-lg border border-gold/20">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gold" />
                <p className="text-lg font-medium text-gold">Hora</p>
                <p className="text-3xl font-bold text-oliveAccent">
                  {evento.time}
                </p>
              </div>
            </div>
          </div>

          {/* Guest information */}
          <div className="{`bg-white/90 backdrop-blur-sm`}">
            <p className="text-2xl font-medium leading-relaxed text-gray-800 text-center">
              {numberOfGuests > 0
                ? `¡Puedes asistir con ${numberOfGuests} acompañante${numberOfGuests > 1 ? "s" : ""
                }!`
                : "Te esperamos con mucha alegría, disfruta este gran día con nosotros 💖"}
            </p>
          </div>

          {/* Iconos informativos con mejor guía visual */}
          <div className="py-8 px-4">
            <h3 className="text-center text-lg font-medium text-amber-800 mb-6">
              ¿Qué deseas hacer?
            </h3>
            <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
              {/* Botón de Confirmación - Destacado */}
              <div className="w-full">
                <button
                  onClick={abrirModal}
                  className="w-full flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
                >
                  <Calendar className="w-6 h-6" />
                  <div className="text-left">
                    <p className="font-medium text-lg">Confirmar Asistencia</p>
                    <p className="text-sm opacity-90">
                      ¡Toca aquí para confirmar tu asistencia!
                    </p>
                  </div>
                </button>
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                {/* Botón de Ubicación */}
                <button
                  onClick={abrirGoogleMaps}
                  className="flex flex-col items-center p-4 bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-lg border border-amber-200/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center mb-2">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <p className="text-amber-900 font-medium">Ver Ubicación</p>
                  <p className="text-amber-700/80 text-sm">¿Cómo llegar?</p>
                </button>

                {/* Botón de Regalos */}
                <button
                  onClick={abrirModalRegalos}
                  className="flex flex-col items-center p-4 bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-lg border border-amber-200/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center mb-2">
                    <Gift className="text-white" size={24} />
                  </div>
                  <p className="text-amber-900 font-medium">Lista de Regalos</p>
                  <p className="text-amber-700/80 text-sm">Ver sugerencias</p>
                </button>
              </div>
            </div>
          </div>

          {/* Mensaje final */}
          <div className="text-center p-7 bg-gradient-to-b from-white/70 to-amber-50/30 backdrop-blur-sm rounded-lg mt-2 shadow-sm max-w-md mx-auto overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"></div>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <span className="absolute -left-24 top-1/2 w-16 h-px bg-gradient-to-r from-transparent to-amber-200/70"></span>
                <h3 className="text-amber-800 font-serif text-lg tracking-wide">
                  Código de Vestimenta
                </h3>
                <span className="absolute -right-24 top-1/2 w-16 h-px bg-gradient-to-l from-transparent to-amber-200/70"></span>
              </div>

              <p className="text-gray-700 font-medium tracking-wider">
                Formal Elegante
              </p>

              <div className="w-full max-w-[300px] mx-auto space-y-6">
                {/* Vestimenta con actitud */}
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <p className="text-amber-900 font-semibold">Damas 💃</p>
                    <ul className="text-gray-700 space-y-1">
                      <li>
                        <span className="text-amber-700">•</span>Vestido largo
                        que grite *realeza*.
                      </li>
                      <li>
                        <span className="text-amber-700">•</span>Colores
                        vibrantes, nada de "modo sigilo".
                      </li>
                      <li>
                        <span className="text-amber-700">•</span>Tacones que
                        dominen el mundo.
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="text-amber-900 font-semibold">
                      Caballeros 🤵
                    </p>
                    <ul className="text-gray-700 space-y-1">
                      <li>
                        <span className="text-amber-700">•</span>Traje digno de
                        Tony Stark o 007.
                      </li>
                      <li>
                        <span className="text-amber-700">•</span>Corbata o moño,
                        porque el estilo manda.
                      </li>
                      <li>
                        <span className="text-amber-700">•</span>Zapatos listos
                        para la alfombra roja.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Aviso Stark */}
                <div className="relative">
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent my-5"></div>
                  <div className="bg-amber-50/90 p-3 rounded-lg border border-amber-300/50 shadow-sm text-center">
                    <p className="text-amber-800 font-medium">
                      ✧ La única de blanco será la novia. No insistas. ✧
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"></div>
          </div>

          {/* Countdown timer (mobile only) */}
          <div className="md:hidden">
            <ContadorRegresivo fecha={evento?.date} />
          </div>

          {/* Imagen final */}
          <div className="block sm:hidden relative w-full h-full">
            <div className="absolute  bg-gold/10 z-10"></div>
            <ImprovedCarousel images={evento?.secondaryImages || []} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
          onClick={cerrarModal} // Cierra el modal al hacer clic fuera
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al hacer clic dentro
          >
            <ConfirmacionForm
              invitationUrl={invitado?.invitationUrl}
              numberOfGuests={numberOfGuests}
              defaultValues={{
                willAttend: invitado?.status === "confirmed" ? true : null, // Muestra el estado actual
                companions: [],
                favoriteSongs: [{ song: "" }],
                allergies: "",
                specialRequests: "",
                personalMessage: "",
                additionalGuestNames: [],
                suggestedSongs: [],
              }}
              eventDetails={{ invitado, evento }}
              isConfirmed={invitado?.status === "confirmed"} // Nueva prop para controlar el botón
              onConfirmSuccess={() => {
                setShowConfirmation(true);
                localStorage.setItem(`confirmationShown_${guestId}`, "true");
                setTimeout(() => setShowConfirmation(false), 5000);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de Lista de Regalos */}
      {modalAbiertoRegalos && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
          onClick={cerrarModalRegalos} // Cierra el modal al hacer clic fuera
        >


          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al hacer clic dentro
          >

            <ListaRegalos
              eventDetails={evento}
              fontClass={fontClass}
            />
          </div>
        </div>


      )}

    </>
  );
}
