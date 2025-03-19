import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Heart, Music, Calendar, Mail } from "lucide-react"

const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4'
};

const variantClasses = {
    primary: 'border-t-slate-800 border-r-slate-800 border-b-slate-800/20 border-l-slate-800/20',
    elegant: 'border-t-stone-700 border-r-stone-700 border-b-stone-700/20 border-l-stone-700/20',
    gold: 'border-t-amber-700 border-r-amber-700 border-b-amber-700/20 border-l-amber-700/20',
    silver: 'border-t-zinc-500 border-r-zinc-500 border-b-zinc-500/20 border-l-zinc-500/20',
    pearl: 'border-t-neutral-400 border-r-neutral-400 border-b-neutral-400/20 border-l-neutral-400/20',
    light: 'border-t-white border-r-white border-b-white/20 border-l-white/20'
};

const ElegantLoader = ({
    size = 'md',
    variant = 'primary',
    className,
    text,
    textClassName = 'text-gray-600 dark:text-gray-400',
    error = null,
    ...props
}) => {
    const [loadingPhase, setLoadingPhase] = React.useState(0)
    const [dots, setDots] = React.useState("")

    // Animated dots
    React.useEffect(() => {
        if (error) return

        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
        }, 400)

        return () => clearInterval(interval)
    }, [error])

    // Progress through loading phases
    React.useEffect(() => {
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
                return <Loader2 className="h-10 w-10 text-slate-800 animate-spin" />
            case 1:
                return <Heart className="h-10 w-10 text-slate-800 animate-pulse" />
            case 2:
                return <Calendar className="h-10 w-10 text-slate-800 animate-bounce" />
            case 3:
                return <Music className="h-10 w-10 text-slate-800 animate-pulse" />
            default:
                return <Loader2 className="h-10 w-10 text-slate-800 animate-spin" />
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
                    <div className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-slate-200 rounded-tl-lg opacity-70"></div>
                    <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-slate-200 rounded-br-lg opacity-70"></div>

                    {/* Icon container with gradient background */}
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-md">
                        {renderIcon()}
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {getMessage()}
                    <span className="text-slate-800">{dots}</span>
                </h2>

                <p className="text-gray-500 italic">Estamos preparando una experiencia especial para ti</p>

                {/* Progress bar */}
                <div className="mt-6 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-slate-400 to-slate-500 transition-all duration-300 ease-in-out"
                        style={{ width: `${(loadingPhase + 1) * 25}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default ElegantLoader;
