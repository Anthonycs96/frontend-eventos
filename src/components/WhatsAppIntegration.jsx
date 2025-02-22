import React, { useState, useEffect } from "react";
import socket from "@/utils/socket"; // Importar socket
import API from "@/utils/api"; // Cliente Axios
import Modal from "./Modal";
import Button from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WhatsAppIntegration = ({
  isOpen,
  onClose,
  userId,
  isConnected,
  onConnectionChange,
}) => {
  const [qr, setQr] = useState(null); // Estado del QR
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [waitingForQr, setWaitingForQr] = useState(false);

  useEffect(() => {
    // Verificar estado de WhatsApp al cargar el componente
    const checkWhatsAppStatus = async () => {
      try {
        const response = await API.get(`/whatsapp/status?userId=${userId}`);
        onConnectionChange(response.data.isConnected); // Actualizar estado global
      } catch (error) {
        console.error("Error al verificar conexión de WhatsApp:", error);
      }
    };

    checkWhatsAppStatus(); // Ejecutar verificación al montar el componente

    // Escuchar eventos del socket
    const handleQrEvent = ({ userId: emittedUserId, qr }) => {
      if (emittedUserId === userId) {
        setQr(qr);
        setWaitingForQr(false); // QR recibido, ya no esperamos
        setLoading(false);
      }
    };

    const handleReadyEvent = ({ userId: emittedUserId }) => {
      if (emittedUserId === userId) {
        onConnectionChange(true); // Conexión lista
        setLoading(false);
      }
    };

    const handleDisconnectedEvent = ({ userId: emittedUserId }) => {
      if (emittedUserId === userId) {
        onConnectionChange(false); // Conexión perdida
        setQr(null);
      }
    };

    socket.on("qr", handleQrEvent);
    socket.on("whatsapp_ready", handleReadyEvent);
    socket.on("whatsapp_disconnected", handleDisconnectedEvent);

    return () => {
      socket.off("qr", handleQrEvent);
      socket.off("whatsapp_ready", handleReadyEvent);
      socket.off("whatsapp_disconnected", handleDisconnectedEvent);
    };
  }, [userId, onConnectionChange]);

  const handleConnect = async () => {
    try {
      setWaitingForQr(true);
      setQr(null);
      setError(null);
      setLoading(true);

      console.log("Intentando conectar WhatsApp con userId:", userId); // Debug

      // Verificamos si ya está conectado
      const response = await API.get(`/whatsapp/status?userId=${userId}`);
      if (response.data.isConnected) {
        onConnectionChange(true);
        setLoading(false);
        return;
      }

      // Si no está conectado, inicia la conexión y genera QR
      await API.post("/whatsapp/connect", { userId });
    } catch (error) {
      console.error("Error al conectar WhatsApp:", error);
      setError("No se pudo conectar WhatsApp. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      setError(null);
      await API.post("/whatsapp/disconnect", { userId });
      onConnectionChange(false); // Desconectado
    } catch (error) {
      console.error("Error al desconectar WhatsApp:", error);
      setError("No se pudo desconectar WhatsApp. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isConnected
              ? "WhatsApp Web Conectado"
              : "Conexión con WhatsApp Web"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isConnected
              ? "Tu WhatsApp está conectado y listo para usar."
              : "Escanea el código QR para conectar tu WhatsApp y enviar mensajes desde la app."}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {waitingForQr && (
            <p className="text-gray-500">Esperando QR para conectar...</p>
          )}
          {!isConnected && qr && (
            <img src={qr} alt="Código QR" className="w-48 h-48" />
          )}
          {loading && !qr && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className={`w-full ${
              isConnected
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
            onClick={isConnected ? handleDisconnect : handleConnect}
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : isConnected
              ? "Desconectar WhatsApp"
              : "Conectar WhatsApp"}
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default WhatsAppIntegration;
