"use client"

import { useEffect, useState } from "react"
import { Loader2, Heart, Music, Calendar, Mail } from "lucide-react"

export default function ElegantLoader({ error = null }) {
    const [loadingPhase, setLoadingPhase] = useState(0)
    const [dots, setDots] = useState("")

    // Animated dots
    useEffect(() => {
        if (error) return

        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
        }, 400)

        return () => clearInterval(interval)
    }, [error])

    // Progress through loading phases
    useEffect(() => {
        if (error) return

        const interval = setInterval(() => {
            setLoadingPhase((prev) => (prev < 4 ? prev + 1 : prev))
        }, 800)

        return () => clearInterval(interval)
    }, [error])

    // Error state
    if (error) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
                <div className="text-center p-8 max-w-md rounded-lg bg-white shadow-xl border border-red-200">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-red-600 mb-2">¡Ups! Algo salió mal</h2>
                    <p className="text-gray-600 mb-4">No pudimos cargar la invitación. Por favor, inténtalo de nuevo.</p>
                    <div className="bg-red-50 p-3 rounded-md text-red-700 text-sm">{error}</div>
                </div>
            </div>
        )
    }

    // Loading icons based on phase
    const renderIcon = () => {
        switch (loadingPhase) {
            case 0:
                return <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
            case 1:
                return <Heart className="h-10 w-10 text-pink-500 animate-pulse" />
            case 2:
                return <Calendar className="h-10 w-10 text-pink-500 animate-bounce" />
            case 3:
                return <Music className="h-10 w-10 text-pink-500 animate-pulse" />
            default:
                return <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
        }
    }

    // Loading messages based on phase
    const getMessage = () => {
        switch (loadingPhase) {
            case 0:
                return "Preparando tu invitación"
            case 1:
                return "Cargando los detalles del evento"
            case 2:
                return "Casi listo"
            case 3:
                return "Finalizando los últimos detalles"
            default:
                return "Cargando"
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
            <div className="text-center p-8 max-w-md">
                <div className="relative mb-6">
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-pink-200 rounded-tl-lg opacity-70"></div>
                    <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-pink-200 rounded-br-lg opacity-70"></div>

                    {/* Icon container with gradient background */}
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center shadow-md">
                        {renderIcon()}
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {getMessage()}
                    <span className="text-pink-500">{dots}</span>
                </h2>

                <p className="text-gray-500 italic">Estamos preparando una experiencia especial para ti</p>

                {/* Progress bar */}
                <div className="mt-6 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-300 ease-in-out"
                        style={{ width: `${(loadingPhase + 1) * 25}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

