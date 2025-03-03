"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useEventData } from "@/components/hooks/useEventData";
import HeaderInvitacion from "@/components/HeaderInvitacion";
import HeaderInvitacionTitulo from "@/components/HeaderInvitacionTitulo";
import ConfirmacionForm from "@/components/ConfirmacionForm";
import { ImprovedCarousel } from "@/components/ui/SimpleCarousel";
import ContadorRegresivo from "@/components/ContadorRegresivo";
import TarjetaInvitation from "@/components/TarjetaInvitation";
import { dancingScript } from "@/styles/fonts";

export default function FormularioInvitado() {
    const params = useParams();
    const { eventId, guestId } = params;
    const { invitado, evento, isLoading, error } = useEventData(eventId, guestId);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent); // Detectar si el usuario está en iOS
    console.log(invitado);

    // Iniciar música (Autoplay en Android, botón en iOS)
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

    // En Android, iniciar la música automáticamente
    useEffect(() => {
        if (!isIOS) {
            startMusic();
        }
    }, [evento]);

    // Detener música si el componente se desmonta
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

    const numberOfGuests = invitado?.numberOfGuests ?? 0;

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center sm:py-12 sm:px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Contenido principal */}
            <div className="relative z-10 w-full max-w-5xl text-center">
                {/* Ocultar HeaderInvitacionTitulo en modo móvil */}
                <div className="hidden sm:block">
                    <HeaderInvitacionTitulo evento={evento} fontClass={dancingScript.className} />
                </div>

                {/* Ocultar HeaderInvitacion en modo móvil */}
                <div className="hidden sm:block top-0 left-0 right-0 z-20">
                    <HeaderInvitacion invitado={invitado} fontClass={dancingScript.className} />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="">
                        <TarjetaInvitation evento={evento} invitado={invitado} numberOfGuests={numberOfGuests} fontClass={dancingScript.className} />
                    </div>
                    <div className="hidden sm:block space-y-6">
                        {/* Ocultar ContadorRegresivo en modo móvil */}
                        <div className="hidden sm:block">
                            <ContadorRegresivo fecha={evento?.date} />
                        </div>

                        {/* Mostrar siempre el formulario de confirmación */}
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
                                // Aquí puedes agregar lógica adicional si es necesario
                                console.log("Confirmación exitosa");
                            }}
                        />

                        <ImprovedCarousel images={evento?.secondaryImages || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}