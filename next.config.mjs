/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "i.pinimg.com",
            "pinimg.com",
            "youtu.be",
            "photos.fife.usercontent.google.com",
            "photos.google.com",
            "es.pinterest.com",
            "scontent.flim23-1.fna.fbcdn.net", // Dominio de la imagen que proporcionaste
            "instagram.flim23-1.fna.fbcdn.net", // Dominio de las imágenes de Instagram
            "fbcdn.net", // Dominio general de Facebook
            "cdninstagram.com", // Dominio general de Instagram
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.fbcdn.net", // Permite todas las subredes de fbcdn.net
            },
            {
                protocol: "https",
                hostname: "**.cdninstagram.com", // Permite todas las subredes de cdninstagram.com
            },
            {
                protocol: "https",
                hostname: "**.instagram.com", // Permite todas las subredes de Instagram
            },
        ],
    },
};

export default nextConfig;