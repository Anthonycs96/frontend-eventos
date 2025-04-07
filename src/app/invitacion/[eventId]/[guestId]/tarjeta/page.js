"use client"

import { useParams } from "next/navigation"
import { useState, useEffect, useRef, useCallback, memo } from "react"
import { useEventData } from "@/components/hooks/useEventData"
import HeaderInvitacion from "@/components/HeaderInvitacion"
import HeaderInvitacionTitulo from "@/components/HeaderInvitacionTitulo"
import ConfirmacionForm from "@/components/ConfirmacionForm"
import { ImprovedCarousel } from "@/components/ui/SimpleCarousel"
import ContadorRegresivo from "@/components/ContadorRegresivo"
import TarjetaInvitation from "@/components/TarjetaInvitation"
import { dancingScript } from "@/styles/fonts"
import ElegantLoader from "@/components/ElegantLoader"
import Head from 'next/head'
import AudioPlayerEvent from '@/components/AudioPlayerEvent';

// Memoización de componentes pesados
const MemoizedCarousel = memo(ImprovedCarousel);
const MemoizedTarjetaInvitation = memo(TarjetaInvitation);

function LoadingState() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <ElegantLoader />
        </div>
    );
}

function ErrorState({ error }) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <ElegantLoader error={error} />
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg"
            >
                Reintentar
            </button>
        </div>
    );
}

export default function FormularioInvitado() {
    const params = useParams();
    const { eventId, guestId } = params;
    const { invitado, evento, isLoading, error } = useEventData(eventId, guestId);
    const numberOfGuests = invitado?.numberOfGuests ?? 0;

    // Early returns para estados de carga y error
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;

    // Valores por defecto para el formulario
    const defaultFormValues = {
        willAttend: null,
        companions: [],
        favoriteSongs: [{ song: "" }],
        allergies: "",
        specialRequests: "",
        personalMessage: "",
        additionalGuestNames: [],
        suggestedSongs: [],
    };

    return (
        <>
            <Head>
                <title>{`Invitación: ${evento?.title || 'Evento Especial'}`}</title>
                <meta name="description" content={`Te invitamos a acompañarnos en ${evento?.title}`} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* Audio Player Component */}
            <AudioPlayerEvent songUrl={evento?.songUrl} />

            <div className="relative min-h-screen flex flex-col justify-center items-center sm:py-0 px-0 sm:px-6 lg:px-8 overflow-hidden">
                <main className="relative z-10 w-full max-w-5xl text-center">
                    {/* Sección de encabezado */}
                    <header className="hidden sm:block space-y-4">
                        <HeaderInvitacionTitulo
                            evento={evento}
                            fontClass={dancingScript.className}
                        />
                        <HeaderInvitacion
                            invitado={invitado}
                            fontClass={dancingScript.className}
                        />
                    </header>

                    {/* Contenido principal */}
                    <div className="grid md:grid-cols-2 gap-8 mt-0">
                        <section>
                            <MemoizedTarjetaInvitation
                                evento={evento}
                                invitado={invitado}
                                numberOfGuests={numberOfGuests}
                                fontClass={dancingScript.className}
                            />
                        </section>

                        <section className="hidden sm:block space-y-6">
                            <ContadorRegresivo fecha={evento?.date} />

                            <ConfirmacionForm
                                invitationUrl={invitado?.invitationUrl}
                                numberOfGuests={numberOfGuests}
                                defaultValues={defaultFormValues}
                                eventDetails={{ invitado, evento }}
                                onConfirmSuccess={() => {
                                    console.log("Confirmación exitosa");
                                    // Implementar lógica adicional aquí
                                }}
                            />

                            <MemoizedCarousel images={evento?.secondaryImages || []} />
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}

