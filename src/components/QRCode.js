
"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const QRCode = ({ userId }) => {
  const [qrCode, setQrCode] = useState(null); // QR en formato Base64
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io("http://192.168.0.104:4000"); // Cambia según la URL de tu backend

    // Confirmar conexión del socket
    socket.on("connect", () => {
      console.log("Socket.IO conectado:", socket.id);
    });

    // Escuchar el evento 'qr'
    socket.on("qr", (data) => {
      console.log("Evento QR recibido:", data);
      setQrCode(data.qr); // Actualiza el estado con el QR recibido
      setLoading(false);
    });

    // Desconectar socket al desmontar componente
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Muestra un mensaje de carga mientras se espera el QR
  if (loading) {
    return <div className="text-center text-gray-600">Cargando código QR...</div>;
  }

  // Muestra un mensaje de error si no se puede cargar el QR
  if (!qrCode) {
    return <div className="text-center text-red-500">No se pudo cargar el código QR.</div>;
  }

  // Renderizar el QR como imagen
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <img
        src={qrCode} // Utiliza directamente el string recibido como `src`
        alt="Código QR"
        className="w-48 h-48 mx-auto"
      />
    </div>
  );
};

export default QRCode;
