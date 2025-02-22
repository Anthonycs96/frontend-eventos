import { useState, useEffect } from "react";

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
        <div className="relative shadow-lg rounded-lg p-6 text-center border-white overflow-hidden">
            {/* Imagen de fondo dinámica */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url(${imageUrl || "/image/fondo2.jpg"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.8)",
                }}
            ></div>

            {/* Contenido del contador */}
            <div className={`relative z-10 p-4 rounded-lg text-white`}>
                <h2 className="text-2xl font-bold mb-4">Tiempo restante</h2>
                <div className="flex justify-center space-x-4">
                    {Object.entries(tiempoRestante).map(([unidad, valor]) => (
                        <div key={unidad} className="flex flex-col items-center">
                            <span className="text-4xl font-bold">{valor}</span>
                            <span className="text-sm">{unidad}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
