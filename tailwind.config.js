/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // ✅ modo oscuro controlado por clase
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // ✅ escanea todos tus componentes
    ],
    theme: {
        extend: {
            // Aquí puedes personalizar colores, fuentes, etc.
        },
    },
    plugins: [],
};
