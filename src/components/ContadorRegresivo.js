import { useState, useEffect } from "react";
import { Clock, Calendar, Hourglass, Zap } from "lucide-react"; // Importar iconos

export default function ContadorRegresivo({ fecha, theme, imageUrl }) {
    // ✅ Convertir `fecha` a objeto Date si es una string
    const fechaEvento = new Date(fecha);

    const [tiempoRestante, setTiempoRestante] = useState(() => calcularTiempoRestante(fechaEvento));

    useEffect(() => {
        const intervalo = setInterval(() => {
            setTiempoRestante(calcularTiempoRestante(fechaEvento));
        }, 1000);
        return () => clearInterval(intervalo);
    }, [fecha]); // ✅ Dependencia corregida para que actualice al cambiar `fecha`

    function calcularTiempoRestante(fecha) {
        if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
            console.error("Fecha inválida:", fecha);
            return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
        }

        const ahora = new Date();
        const diferencia = fecha.getTime() - ahora.getTime();

        if (diferencia <= 0) {
            return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
        }

        return {
            dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
            horas: Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutos: Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60)),
            segundos: Math.floor((diferencia % (1000 * 60)) / 1000),
        };
    }

    return (
        <div className="relative shadow-2xl rounded-lg p-4 text-center overflow-hidden w-full max-w-xs sm:max-w-md mx-auto py-12 px-4">
            {/* Imagen de fondo dinámica */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.6)",
                }}
            ></div>

            {/* Contenido del contador */}
            <div className="relative z-10 text-black ">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" /> Tiempo Restante
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-center sm:space-x-2 sm:gap-0">
                    {Object.entries(tiempoRestante).map(([unidad, valor]) => (
                        <div
                            key={unidad}
                            className="flex flex-col items-center bg-black bg-opacity-50 p-2 sm:p-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 border-2 border-white/20"
                        >
                            <span className="text-2xl sm:text-4xl font-bold animate-bounce text-white/90">
                                {valor}
                            </span>
                            <span className="text-xs sm:text-sm uppercase mt-1 flex items-center gap-1 text-white/80">
                                {unidad === "dias" && <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />}
                                {unidad === "horas" && <Hourglass className="w-3 h-3 sm:w-4 sm:h-4" />}
                                {unidad === "minutos" && <Zap className="w-3 h-3 sm:w-4 sm:h-4" />}
                                {unidad === "segundos" && <Clock className="w-3 h-3 sm:w-4 sm:h-4" />}
                                {unidad}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Efecto de brillo en los números */}
            <style>
                {`
                    .animate-bounce {
                        animation: bounce 1s infinite;
                    }
                    @keyframes bounce {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-10px);
                        }
                    }
                    .shadow-lg {
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
                    }
                `}
            </style>
        </div>
    );
}