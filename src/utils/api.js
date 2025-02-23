import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASEURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// const API = axios.create({
//     baseURL: 'https://backend-eventos-m5gv.onrender.com/api',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// Interceptor para incluir el token solo en rutas protegidas
API.interceptors.request.use((config) => {
    const publicRoutes = [
        '/events/', // Ruta pública para eventos
        '/guest/guest/' // Ruta pública para invitados
    ];

    const isPublicRoute = publicRoutes.some((publicRoute) => config.url.startsWith(publicRoute));

    if (!isPublicRoute) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API; // Asegúrate de que esta línea exista
