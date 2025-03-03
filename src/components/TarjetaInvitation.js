"use client"

import Image from "next/image"
import { Calendar, MapPin, Gift, Clock, Volume2, VolumeX, Heart } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import HeaderInvitacion from "@/components/HeaderInvitacion";
import ContadorRegresivo from "@/components/ContadorRegresivo"
import ConfirmacionForm from "@/components/ConfirmacionForm";
import { ImprovedCarousel } from "@/components/ui/SimpleCarousel";



export default function TarjetaInvitation({ evento, numberOfGuests, invitado, fontClass }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [startY, setStartY] = useState(null)
    const [endY, setEndY] = useState(null)
    const [imgError, setImgError] = useState(false)
    const [player, setPlayer] = useState(null) // Estado para el reproductor de YouTube
    const [modalAbierto, setModalAbierto] = useState(false);

    const abrirModal = () => setModalAbierto(true);
    const cerrarModal = () => setModalAbierto(false);

    // Extraer el ID del video de YouTube
    const getYouTubeVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return match && match[2].length === 11 ? match[2] : null
    }

    // URL de YouTube embebida
    const youtubeEmbedUrl = evento?.songUrl
        ? `https://www.youtube.com/embed/${getYouTubeVideoId(evento.songUrl)}?enablejsapi=1`
        : null

    // Cargar la API de YouTube IFrame
    useEffect(() => {
        const tag = document.createElement("script")
        tag.src = "https://www.youtube.com/iframe_api"
        const firstScriptTag = document.getElementsByTagName("script")[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

        // Inicializar el reproductor de YouTube
        window.onYouTubeIframeAPIReady = () => {
            const newPlayer = new window.YT.Player("youtube-player", {
                videoId: getYouTubeVideoId(evento.songUrl),
                events: {
                    onReady: (event) => {
                        setPlayer(event.target)
                    },
                },
            })
        }
    }, [evento?.songUrl])

    // Reproducir música
    const startMusic = useCallback(() => {
        if (player && player.playVideo) {
            player.playVideo()
            setIsPlaying(true)
        }
    }, [player])

    // Pausar/reanudar música
    const toggleMusic = () => {
        if (player) {
            if (isPlaying) {
                player.pauseVideo()
            } else {
                player.playVideo()
            }
            setIsPlaying(!isPlaying)
        }
    }

    // Manejo de gestos táctiles
    const handleTouchStart = useCallback((e) => {
        setStartY(e.touches[0].clientY)
    }, [])

    const handleTouchMove = useCallback((e) => {
        setEndY(e.touches[0].clientY)
    }, [])

    const handleTouchEnd = useCallback(() => {
        if (startY !== null && endY !== null && !isPlaying) {
            startMusic()
        }
    }, [isPlaying, startMusic, startY, endY])

    // Iniciar música después de la interacción del usuario
    useEffect(() => {
        const handleInteraction = () => {
            if (!isPlaying) {
                startMusic()
                document.removeEventListener("click", handleInteraction)
                document.removeEventListener("touchstart", handleInteraction)
            }
        }

        document.addEventListener("click", handleInteraction)
        document.addEventListener("touchstart", handleTouchStart)
        document.addEventListener("touchmove", handleTouchMove)
        document.addEventListener("touchend", handleTouchEnd)

        return () => {
            document.removeEventListener("click", handleInteraction)
            document.removeEventListener("touchstart", handleTouchStart)
            document.removeEventListener("touchmove", handleTouchMove)
            document.removeEventListener("touchend", handleTouchEnd)
        }
    }, [isPlaying, handleTouchEnd, handleTouchStart, handleTouchMove, startMusic])

    if (!evento) {
        return (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-md mx-auto p-6 text-center">
                <p className="text-gray-600">Cargando datos del evento...</p>
            </div>
        )
    }

    const imageUrl = evento.imageUrl?.startsWith("http")
        ? evento.imageUrl
        : "https://via.placeholder.com/600x300?text=Evento"
    const { name, date, time, location } = evento

    const fechaObj = new Date(date)
    const dia = fechaObj.toLocaleDateString("es-ES", { day: "2-digit" })
    const mes = fechaObj.toLocaleDateString("es-ES", { month: "short" }).toUpperCase()
    const anio = fechaObj.getFullYear()

    const abrirGoogleMaps = () => {
        const direccion = location || "Ubicación no disponible"
        const url = `https://www.google.com/maps?q=${encodeURIComponent(direccion)}`
        window.open(url, "_blank")
    }
    return (
        <>

            <div className="max-w w-full bg-white rounded-lg overflow-hidden shadow-lg border border-gold/20">
                {/* Control de música */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={toggleMusic}
                        className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md"
                    >
                        {isPlaying ? <Volume2 className="text-gold" size={20} /> : <VolumeX className="text-gold" size={20} />}
                    </button>
                </div>

                {/* Reproductor de YouTube embebido */}
                {youtubeEmbedUrl && (
                    <iframe
                        id="youtube-player"
                        src={youtubeEmbedUrl}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        style={{ display: "none" }}
                    />
                )}

                <div
                    className="relative overflow-hidden max-w-lg mx-auto transform transition duration-500 from-black/0 via-black/20 to-black/0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${imageUrl || "/placeholder.svg"})`
                    }}
                >
                    {/* Overlay para mejor contraste */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-black/20 pointer-events-none md:hidden"></div>



                    {/* Frase principal */}
                    <div className="text-center p-6 space-y-4 ">

                        <div className="relative">
                            <p className={`text-5xl sm:text-7xl lg:text-5xl font-bold text-gold drop-shadow-[2px_2px_4px_rgba(139, 101, 23, 0.7)] mb-2 ${fontClass}`}>
                                {evento.description}
                            </p>


                        </div>





                        {/* Ilustración floral */}
                        <div className="flex justify-center py-2">
                            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                "El amor nos une y la familia nos fortalece. Nada nos haría más felices que compartir nuestra alegría con quienes más queremos."
                            </p>
                            <p className="text-gold text-sm">Romanos 12:10</p>
                        </div>
                    </div>

                    {/* Nombres de los novios */}
                    <div className="text-center py-4 bg-champagne/30 items-center flex flex-col ">
                        <div className="w-16 h-1 bg-amber-300 mb-4 rounded-full"></div>
                        <h1 className={`${fontClass} text-gold text-5xl drop-shadow-[2px_2px_4px_rgba(139, 101, 23, 0.7)] mb-5 `}>{evento.name}</h1>
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
                                <p className="text-3xl font-bold text-oliveAccent">{evento.time}</p>
                            </div>
                        </div>
                    </div>
                    {/* Guest information */}
                    <div className="{`bg-white/90 backdrop-blur-sm`}">
                        <p className="text-2xl font-medium leading-relaxed text-gray-800 text-center">
                            {numberOfGuests > 0
                                ? `¡Puedes asistir con ${numberOfGuests} acompañante${numberOfGuests > 1 ? "s" : ""}!`
                                : "Te esperamos con mucha alegría, disfruta este gran día con nosotros 💖"}
                        </p>
                    </div>

                    {/* Mensaje final */}
                    <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-lg border border-amber-200/20 mt-2 shadow-sm max-w-md mx-auto">
                        <p className="text-gray-700 text-lg font-medium">
                            ✧ <span className="text-amber-600 font-semibold">Vestimenta:</span> Código de vestimenta formal.
                            <br />¡Vístete con elegancia para esta ocasión especial!
                        </p>
                    </div>

                    {/* Iconos informativos */}
                    <div className="flex justify-center space-x-8 p-6 ">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center border-2 border-gold/20" onClick={abrirGoogleMaps}>
                                <MapPin className="text-white" size={20} />
                            </div>
                            <p className="text-oliveAccent text-xs mt-2">Local de Celebracion</p>
                        </div>
                        <div className="block sm:hidden flex flex-col items-center">
                            <div className=" w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-gold/20"
                                onClick={abrirModal}>
                                <Calendar className="text-white" size={20} />
                            </div>
                            <p className="text-oliveAccent text-xs mt-2">Confirma Asistencia</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center border-2 border-gold/20">
                                <Gift className="text-white" size={20} />
                            </div>
                            <p className="text-oliveAccent text-xs mt-2">Lista de Presentes</p>
                        </div>
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
        </>

    )
}