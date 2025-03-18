import { useState } from "react";
import { Clipboard } from "lucide-react";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function SendCustomMessageModal({ guest, onClose, onSend }) {
    const [message, setMessage] = useState(
        `Hola ${guest.name},\n\nCon mucha alegría, Ale y Richi queremos invitarte a nuestro matrimonio. Será un placer contar con tu presencia. Por favor, confirma tu asistencia haciendo clic en el siguiente enlace:\n\n${guest.invitationUrl}\n\n¡Esperamos verte pronto!`
    );

    const handleSend = () => {
        onSend(guest, message);
        onClose();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(message)
            .then(() => alert("Mensaje copiado al portapapeles"))
            .catch(err => console.error('Error al copiar:', err));
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Enviar mensaje personalizado</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Enviando mensaje a: <span className="font-semibold">{guest.name}</span>
                    </p>
                    
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe tu mensaje personalizado aquí..."
                        rows={6}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <p className="text-sm text-gray-600">
                        Confirmación de asistencia:{" "}
                        <a
                            href={guest.invitationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline hover:text-blue-700"
                        >
                            {guest.invitationUrl}
                        </a>
                    </p>
                    
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="flex items-center gap-1"
                        >
                            <Clipboard className="h-4 w-4" />
                            Copiar mensaje
                        </Button>
                        <Button onClick={onClose} variant="outline">
                            Cancelar
                        </Button>
                        <Button onClick={handleSend} variant="default">
                            Enviar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
