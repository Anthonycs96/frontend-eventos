import { io } from "socket.io-client";

// Cambia a la URL de tu backend si estás en producción
const socket = io("http://192.168.0.103:4001", {
    transports: ["websocket", "polling"], // Opciones de transporte
});

// const socket = io("https://backend-eventos-m5gv.onrender.com", {
//     transports: ["websocket", "polling"], // Opciones de transporte
// });

export default socket;
