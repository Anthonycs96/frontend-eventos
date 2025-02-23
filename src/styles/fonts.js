"use client";

import { Dancing_Script } from 'next/font/google';

// Configura la fuente
const dancingScript = Dancing_Script({
    weight: "400", // Peso de la fuente
    subsets: ["latin"], // Subconjunto de caracteres
    display: "swap", // Comportamiento de visualización
});

// Exporta la configuración de la fuente
export { dancingScript };