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
            "es.pinterest.com"
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.fbcdn.net",
            },
            {
                protocol: "https",
                hostname: "**.cdninstagram.com",
            },
        ],
    },
};

export default nextConfig;
