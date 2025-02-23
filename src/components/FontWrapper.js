"use client"; // Asegura que este componente es de cliente

import { dancingScript } from "@/app/fontConfig";

export default function FontWrapper({ children }) {
    return <div className={dancingScript.className}>{children}</div>;
}
