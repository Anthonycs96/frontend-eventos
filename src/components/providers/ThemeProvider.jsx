"use client";
import "@/styles/globals.css"; // Asegúrate de que esta línea esté presente para aplicar los estilos globales

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    // Detectar tema del sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      const systemTheme = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", systemTheme);
      document.documentElement.classList.toggle("dark", e.matches);
    };

    // Establecer tema inicial
    handleChange(mediaQuery);

    // Escuchar cambios
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
