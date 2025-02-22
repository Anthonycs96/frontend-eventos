"use client"

import { useEffect, useState } from "react"
import { Dancing_Script } from "@next/font/google"
import { MapPin, Clock, Calendar, Music } from "lucide-react"



export default function TarjetaMatrimonio({ evento, numberOfGuests }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [startY, setStartY] = useState(null)
    const [endY, setEndY] = useState(null)

    const startMusic = () => {
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
    }

    const handleTouchStart = (e) => {
        setStartY(e.touches[0].clientY)
    }

    const handleTouchMove = (e) => {
        setEndY(e.touches[0].clientY)
    }

    const handleTouchEnd = () => {
        if (startY !== null && endY !== null) {
            if (endY !== startY && !isPlaying) {
                startMusic()
            }
        }
    }

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
    }, [isPlaying]) // Removed unnecessary dependencies

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
        <div
            className={`relative shadow-2xl rounded-3xl overflow-hidden max-w mx-auto transform transition duration-500 hover:scale-105`}
        >
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.6)",
                }}
            ></div>

            <div className="relative z-10 p-8 text-center text-white">
                <h1 className="text-5xl font-bold mb-6 text-orange-200">{name || "Evento Especial"}</h1>

                <div className="flex justify-center items-center gap-8 mb-8">
                    <div className="text-center bg-black bg-opacity-50 p-4 rounded-lg">
                        <Calendar className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-5xl font-bold">{dia}</p>
                        <p className="text-xl font-medium">{mes}</p>
                        <p className="text-lg">{anio}</p>
                    </div>
                    <div className="text-center bg-black bg-opacity-50 p-4 rounded-lg">
                        <Clock className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xl font-medium">Hora</p>
                        <p className="text-3xl font-bold">{time || "Sin hora"}</p>
                    </div>
                </div>
                <p className="text-xl mt-2 cursor-pointer transition-all flex items-center justify-center">Número de acompañantes: {numberOfGuests}</p>
                <div className="border-t border-gray-300 pt-6 mb-6">
                    <h3 className="text-2xl font-semibold mb-2">Ubicación</h3>
                    <p
                        className="text-xl mt-2 cursor-pointer  transition-all flex items-center justify-center"
                        onClick={abrirGoogleMaps}
                    >
                        <MapPin className="w-6 h-6 mr-2" />
                        {location || "Ubicación no disponible"}
                    </p>
                </div>

                <button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center mx-auto"
                    onClick={abrirGoogleMaps}
                >
                    <MapPin className="w-5 h-5 mr-2" />
                    Ver en Google Maps
                </button>

                {isPlaying && (
                    <div className="mt-4 flex items-center justify-center text-yellow-300">
                        <Music className="w-6 h-6 mr-2 animate-pulse" />
                        <span>Música sonando</span>
                    </div>
                )}
            </div>

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

