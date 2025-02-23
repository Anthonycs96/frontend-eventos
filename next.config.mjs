/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        optimizeFonts: false, // Desactiva la optimización de fuentes
    },
    images: {
        domains: [
            "i.pinimg.com",
            "pinimg.com",
            "youtu.be",
            "instagram.flim23-1.fna.fbcdn.net",
            "photos.fife.usercontent.google.com",
            "photos.google.com",
            "instagram.flim18-1.fna.fbcdn.net",
        ],
    },
};

export default nextConfig;
