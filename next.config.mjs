/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Activar modo estricto para detectar errores en desarrollo
    images: {
        domains: [
            "i.pinimg.com",
            "pinimg.com",
            "youtu.be",
            "instagram.flim23-1.fna.fbcdn.net",
            "photos.fife.usercontent.google.com",
            "photos.google.com",
            "instagram.flim18-1.fna.fbcdn.net", // Added the missing domain
        ],
    },
    experimental: {
        appDir: true, // Para soportar la nueva estructura de Next.js (opcional)
    }
};

export default nextConfig;
