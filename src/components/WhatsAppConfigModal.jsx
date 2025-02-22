'use client';

import { useState } from 'react';
//import { QRCodeSVG } from 'qr-code-styling';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import  Button  from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function WhatsAppConfigModal({ isOpen, onClose }) {
  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected
  const [qrCode, setQrCode] = useState('');
  
  // Simular la conexión con WhatsApp Web
  const handleConnect = async () => {
    setStatus('connecting');
    
    // Aquí iría la lógica real de conexión con whatsapp-web.js
    try {
      // Simulación de espera de QR
      setTimeout(() => {
        setQrCode('sample-qr-data');
        setStatus('awaiting-scan');
      }, 1500);
    } catch (error) {
      setStatus('error');
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'disconnected':
        return {
          title: 'WhatsApp no está conectado',
          description: 'Conecta tu cuenta de WhatsApp para enviar invitaciones.',
          icon: <AlertCircle className="h-5 w-5 text-yellow-600" />
        };
      case 'connecting':
        return {
          title: 'Conectando con WhatsApp',
          description: 'Por favor espere mientras establecemos la conexión...',
          icon: <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        };
      case 'connected':
        return {
          title: 'WhatsApp conectado',
          description: '¡Listo para enviar invitaciones!',
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />
        };
      case 'awaiting-scan':
        return {
          title: 'Escanea el código QR',
          description: 'Abre WhatsApp en tu teléfono y escanea el código QR',
          icon: <QRCodeSVG value={qrCode} size={200} />
        };
      default:
        return {
          title: 'Error de conexión',
          description: 'Hubo un problema al conectar con WhatsApp.',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configuración de WhatsApp</DialogTitle>
          <DialogDescription>
            Conecta tu cuenta de WhatsApp para enviar invitaciones automáticamente
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          <Alert variant={status === 'connected' ? 'success' : 'default'} className="w-full">
            <div className="flex items-center gap-3">
              {statusInfo.icon}
              <div>
                <h4 className="font-medium">{statusInfo.title}</h4>
                <AlertDescription>{statusInfo.description}</AlertDescription>
              </div>
            </div>
          </Alert>

          {status === 'awaiting-scan' && (
            <div className="p-4 bg-white rounded-lg shadow-inner">
              {/* <QRCodeSVG value={qrCode} size={200} /> */}
            </div>
          )}

          {status === 'disconnected' && (
            <Button onClick={handleConnect} className="w-full">
              Conectar WhatsApp
            </Button>
          )}

          {status === 'connecting' && (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Conectando...
            </Button>
          )}

          {status === 'connected' && (
            <Button variant="destructive" onClick={() => setStatus('disconnected')} className="w-full">
              Desconectar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

