"use client"

import { useEffect, useState, useCallback } from "react"
import { MapPin, Clock, Calendar, Music, Heart, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"
import ContadorRegresivo from "@/components/ContadorRegresivo"
import HeaderInvitacionTitulo from "@/components/HeaderInvitacionTitulo"

export default function TarjetaMatrimonio({ evento, numberOfGuests, fontClass }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [startY, setStartY] = useState(null)
    const [endY, setEndY] = useState(null)
    const [imgError, setImgError] = useState(false)

    const startMusic = useCallback(() => {
        const iframe = document.getElementById("song-player")
        if (iframe) {
            const songUrl = evento?.songUrl

            if (songUrl && (songUrl.includes("youtube.com") || songUrl.includes("youtu.be"))) {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
            } else if (songUrl) {
                iframe.contentWindow.postMessage(JSON.stringify({ method: "play" }), "*")
            }
            setIsPlaying(true)
        }
    }, [evento?.songUrl])

    const toggleMusic = () => {
        const iframe = document.getElementById("song-player")
        if (iframe) {
            if (isPlaying) {
                if (evento?.songUrl?.includes("youtube.com") || evento?.songUrl?.includes("youtu.be")) {
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
                } else {
                    iframe.contentWindow.postMessage(JSON.stringify({ method: "pause" }), "*")
                }
            } else {
                startMusic()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleTouchStart = useCallback((e) => {
        setStartY(e.touches[0].clientY)
    }, [])

    const handleTouchMove = useCallback((e) => {
        setEndY(e.touches[0].clientY)
    }, [])

    const handleTouchEnd = useCallback(() => {
        if (startY !== null && endY !== null) {
            if (endY !== startY && !isPlaying) {
                startMusic()
            }
        }
    }, [isPlaying, startMusic, startY, endY])

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
        <div className={`relative overflow-hidden max-w-lg mx-auto transform transition duration-500 ${fontClass}`}>
            {/* Background image with gradient overlay */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt="Fondo del Evento"
                    fill
                    className="object-cover"
                    onError={() => setImgError(true)}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/0"></div> {/* Overlay más claro */}
            </div>

            <div className="relative z-10 p-8 text-center text-black min-h-screen flex flex-col justify-between"> {/* Cambiar text-white a text-black */}
                {/* Header section */}
                <div className="pt-8">
                    <div className="md:hidden">
                        <HeaderInvitacionTitulo evento={evento} />
                    </div>

                    <div className="mb-6 flex flex-col items-center">
                        <div className="w-16 h-1 bg-amber-300 mb-4 rounded-full"></div>
                        <h1 className="text-6xl font-bold mb-2 text-amber-400 drop-shadow-lg tracking-wide [text-shadow:_0_2px_4px_rgba(0,0,0,0.8)]">
                            {name || "Evento Especial"}
                        </h1>
                        <div className="w-16 h-1 bg-amber-300 mt-4 rounded-full"></div>
                    </div>

                    <p className="text-3xl italic font-bold text-gray-700 mb-8">{"Te invitamos a celebrar nuestro amor"}</p> {/* Cambiar text-amber-50 a text-gray-700 */}
                </div>

                {/* Main content */}
                <div className="space-y-8">
                    {/* Date and time section */}
                    <div className="flex justify-center items-center gap-8 mb-8">
                        <div className="text-center bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-amber-200/30"> {/* Cambiar bg-black/40 a bg-white/80 */}
                            <Calendar className="w-8 h-8 mx-auto mb-2 text-amber-600" /> {/* Cambiar text-amber-200 a text-amber-600 */}
                            <p className="text-6xl font-bold text-gray-800">{dia}</p> {/* Cambiar text-white a text-gray-800 */}
                            <p className="text-2xl font-medium text-amber-600">{mes}</p> {/* Cambiar text-amber-200 a text-amber-600 */}
                            <p className="text-2xl text-amber-700">{anio}</p> {/* Cambiar text-amber-100 a text-amber-700 */}
                        </div>
                        <div className="text-center bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-amber-200/30"> {/* Cambiar bg-black/40 a bg-white/80 */}
                            <Clock className="w-8 h-8 mx-auto mb-2 text-amber-600" /> {/* Cambiar text-amber-200 a text-amber-600 */}
                            <p className="text-xl font-medium text-amber-600">Hora</p> {/* Cambiar text-amber-200 a text-amber-600 */}
                            <p className="text-4xl font-bold text-gray-800">{time || "Sin hora"}</p> {/* Cambiar text-white a text-gray-800 */}
                        </div>
                    </div>

                    {/* Guest information */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-amber-200/20 max-w-md mx-auto"> {/* Cambiar bg-black/30 a bg-white/80 */}
                        <Heart className="w-6 h-6 mx-auto mb-3 text-rose-500" /> {/* Cambiar text-rose-300 a text-rose-500 */}
                        <p className="text-2xl leading-relaxed text-gray-800"> {/* Cambiar text-white a text-gray-800 */}
                            {numberOfGuests > 0
                                ? `¡Puedes asistir con ${numberOfGuests} acompañante${numberOfGuests > 1 ? "s" : ""}!`
                                : "Te esperamos con mucha alegría, disfruta este gran día con nosotros 💖"}
                        </p>
                    </div>

                    {/* Location section */}
                    <div className="max-w-md mx-auto">
                        <div className="border-t border-amber-200/30 pt-6 mb-6">
                            <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-800">Ubicación</h3> {/* Cambiar text-amber-100 a text-gray-800 */}
                            <p
                                className="text-xl mt-2 cursor-pointer transition-all flex items-center justify-center text-gray-800" // Cambiar text-white a text-gray-800
                                onClick={abrirGoogleMaps}
                            >
                                <MapPin className="w-6 h-6 mr-2 text-amber-600" /> {/* Cambiar text-amber-200 a text-amber-600 */}
                                <span className="hover:underline">{location || "Ubicación no disponible"}</span>
                            </p>
                        </div>

                        <button
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg"
                            onClick={abrirGoogleMaps}
                        >
                            <MapPin className="w-5 h-5 mr-2" />
                            Ver en Google Maps
                        </button>
                    </div>

                    {/* Countdown timer (mobile only) */}
                    <div className="md:hidden mt-8">
                        <ContadorRegresivo fecha={evento?.date} />
                    </div>
                </div>

                {/* Music controls */}
                <div className="mt-8 mb-4">
                    <button
                        onClick={toggleMusic}
                        className="flex items-center justify-center mx-auto bg-white/80 backdrop-blur-sm p-3 rounded-full border border-amber-200/30 hover:bg-white/90 transition-all" // Cambiar bg-black/30 a bg-white/80
                    >
                        {isPlaying ? (
                            <VolumeX className="w-6 h-6 text-amber-600" /> // Cambiar text-amber-200 a text-amber-600
                        ) : (
                            <Volume2 className="w-6 h-6 text-amber-600" /> // Cambiar text-amber-200 a text-amber-600
                        )}
                    </button>
                    {isPlaying && (
                        <div className="mt-2 flex items-center justify-center text-amber-600"> {/* Cambiar text-amber-200 a text-amber-600 */}
                            <Music className="w-5 h-5 mr-2 animate-pulse" />
                            <span className="text-sm">Música sonando</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden music player */}
            {evento?.songUrl && (
                <iframe
                    id="song-player"
                    style={{ display: "none" }}
                    width="0"
                    height="0"
                    src={
                        evento.songUrl.includes("youtube.com") || evento.songUrl.includes("youtu.be")
                            ? `https://www.youtube.com/embed/${new URL(evento.songUrl).searchParams.get("v")}?enablejsapi=1`
                            : evento.songUrl
                    }
                    frameBorder="0"
                    allow="autoplay"
                    allowFullScreen
                ></iframe>
            )}
        </div>
    )
}