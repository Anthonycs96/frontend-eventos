"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState("white"); // opciones: "dark", "white"

  // ⬇️ Esta parte detecta el tema del sistema y aplica la clase correspondiente
  useEffect(() => {
    const html = document.documentElement;

    const handleThemeChange = (e) => {
      html.classList.remove("dark", "white"); // limpia antes de aplicar

      if (e.matches) {
        html.classList.add("dark");
        setDarkMode("dark");
      } else {
        html.classList.add("white");
        setDarkMode("white");
      }
    };

    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    handleThemeChange(prefersDarkMode); // Aplica el tema inicial

    prefersDarkMode.addEventListener("change", handleThemeChange); // Escucha cambios

    return () => {
      prefersDarkMode.removeEventListener("change", handleThemeChange); // Limpia el listener
    };
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}