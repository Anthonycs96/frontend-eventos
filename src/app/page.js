"use client";

import { useEffect, useState } from "react";
import LoginForm from '../components/LoginForm'

export default function Home() {
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
    <div className="min-h-screen p-0 sm:p-6 md:p-8 transition-colors duration-300">
      <LoginForm />
    </div>
  )
}

