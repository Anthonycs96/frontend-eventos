"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useEventData } from "@/components/hooks/useEventData";
import HeaderInvitacion from "@/components/HeaderInvitacion";
import HeaderInvitacionTitulo from "@/components/HeaderInvitacionTitulo";
import ConfirmacionForm from "@/components/ConfirmacionForm";
import ConfirmacionEspecial from "@/components/ConfirmacionEspecial";
import TarjetaMatrimonio from "@/components/TarjetaMatrimonio";
import { ImprovedCarousel } from "@/components/ui/SimpleCarousel";
import ContadorRegresivo from "@/components/ContadorRegresivo";

export default function FormularioInvitado() {
    const params = useParams();
    const { eventId, guestId } = params;
    const { invitado, evento, isLoading, error } = useEventData(eventId, guestId);
    const [imgError, setImgError] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent); // Detectar si el usuario está en iOS

    useEffect(() => {
        if (invitado && invitado.status === "confirmed") {
            const hasShownConfirmation = localStorage.getItem(`confirmationShown_${guestId}`);
            if (!hasShownConfirmation) {
                setShowConfirmation(true);
                localStorage.setItem(`confirmationShown_${guestId}`, "true");
                setTimeout(() => setShowConfirmation(false), 5000);
            }
        }
    }, [invitado, guestId]);

    // 🔹 Iniciar música (Autoplay en Android, botón en iOS)
    const startMusic = () => {
        if (evento?.songUrl && !isPlaying) {
            const audioElement = new Audio(evento.songUrl);
            audioElement.loop = true;

            audioElement.play().then(() => {
                console.log("Música reproducida correctamente");
                setIsPlaying(true);
            }).catch((error) => {
                console.warn("Autoplay bloqueado en iOS. Se necesita interacción del usuario.", error);
            });

            audioRef.current = audioElement;
        }
    };

    // 🔹 En Android, iniciar la música automáticamente
    useEffect(() => {
        if (!isIOS) {
            startMusic();
        }
    }, [evento]);

    // 🔹 Detener música si el componente se desmonta
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const imageUrl = imgError || !evento?.imageUrl?.startsWith("http")
        ? "https://via.placeholder.com/1200x800?text=Evento"
        : evento.imageUrl;

    const numberOfGuests = invitado?.numberOfGuests ?? 0;

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={imageUrl}
                    alt="Fondo del Evento"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl text-white text-center">
                <HeaderInvitacionTitulo evento={evento} />
                <div className="hidden sm:block top-0 left-0 right-0 z-20">
                    <HeaderInvitacion invitado={invitado} />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <TarjetaMatrimonio evento={evento} numberOfGuests={numberOfGuests} />
                        <ContadorRegresivo fecha={evento?.date} />
                        <div className="block sm:hidden">
                            <HeaderInvitacion invitado={invitado} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        {showConfirmation ? (
                            <ConfirmacionEspecial
                                isVisible={true}
                                theme="green"
                                invitadoNombre={invitado?.name}
                            />
                        ) : (
                            <ConfirmacionForm
                                invitationUrl={invitado?.invitationUrl}
                                numberOfGuests={numberOfGuests}
                                defaultValues={{
                                    willAttend: null,
                                    companions: [],
                                    favoriteSongs: [{ song: "" }],
                                    allergies: "",
                                    specialRequests: "",
                                    personalMessage: "",
                                    additionalGuestNames: [],
                                    suggestedSongs: [],
                                }}
                                eventDetails={{ invitado, evento }}
                                onConfirmSuccess={() => {
                                    setShowConfirmation(true);
                                    localStorage.setItem(`confirmationShown_${guestId}`, "true");
                                    setTimeout(() => setShowConfirmation(false), 5000);
                                }}
                            />
                        )}
                        <ImprovedCarousel images={evento?.secondaryImages || []} />
                    </div>
                </div>
            </div>

            {/* 🔹 Botón solo en iOS para iniciar la música */}
            {isIOS && evento?.songUrl && !isPlaying && (
                <button
                    onClick={startMusic}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 50
                    }}
                >
                    🎵 Reproducir Música
                </button>
            )}
        </div>
    );
}
