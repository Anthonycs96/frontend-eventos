import { io } from "socket.io-client";

// Cambia a la URL de tu backend si estás en producción
const socket = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET, {
    transports: ["websocket", "polling"], // Opciones de transporte
});

// const socket = io("https://backend-eventos-m5gv.onrender.com", {
//     transports: ["websocket", "polling"], // Opciones de transporte
// });

export default socket;
