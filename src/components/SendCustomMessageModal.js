import { useState } from "react";
import { Clipboard, MessageCircle, Check, Send, X } from "lucide-react";
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
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(message)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 3000);
            })
            .catch(err => console.error('Error al copiar:', err));
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-gradient-to-br from-white to-gray-50">
                <DialogHeader className="px-6 py-4 border-b bg-white">
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <MessageCircle className="h-5 w-5 text-blue-500" />
                        Mensaje Personalizado
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 py-4 space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <span className="text-sm text-blue-700">
                            Destinatario: <span className="font-semibold">{guest.name}</span>
                        </span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mensaje:</label>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Escribe tu mensaje personalizado aquí..."
                            rows={4}
                            className="w-full min-h-[100px] sm:min-h-[150px] border border-gray-200 rounded-lg p-2 sm:p-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                    </div>

                    <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">
                            Link de confirmación:
                        </p>
                        <a
                            href={guest.invitationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 break-all bg-white p-1 sm:p-2 rounded border border-gray-200 block hover:bg-blue-50 transition-colors duration-200"
                        >
                            {guest.invitationUrl}
                        </a>
                    </div>
                </div>

                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-end items-center gap-2 sm:gap-3">
                    <Button
                        onClick={handleCopy}
                        variant="outline"
                        className={`
                            w-full sm:w-auto flex items-center gap-2 min-w-[140px] justify-center
                            ${isCopied ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' : 'hover:bg-gray-100'}
                        `}
                    >
                        {isCopied ? (
                            <>
                                <Check className="h-4 w-4" />
                                Copiado
                            </>
                        ) : (
                            <>
                                <Clipboard className="h-4 w-4" />
                                Copiar mensaje
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full sm:w-auto flex items-center gap-2 min-w-[140px] justify-center"
                    >
                        <X className="h-4 w-4" />
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSend}
                        variant="default"
                        className="w-full sm:w-auto flex items-center gap-2 min-w-[140px] justify-center bg-blue-600 hover:bg-blue-700"
                    >
                        <Send className="h-4 w-4" />
                        Enviar mensaje
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
