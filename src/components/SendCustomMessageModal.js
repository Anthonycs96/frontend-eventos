import { useState } from "react";
import { X, Clipboard } from "lucide-react";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

export default function SendCustomMessageModal({ guest, onClose, onSend }) {
    const [message, setMessage] = useState(
        `Hola ${guest.name},\n\nCon mucha alegría, Ale y Richi queremos invitarte a nuestro matrimonio. Será un placer contar con tu presencia. Por favor, confirma tu asistencia haciendo clic en el siguiente enlace:\n\n${guest.invitationUrl}\n\n¡Esperamos verte pronto!`
    );

    const handleSend = () => {
        onSend(guest, message);
        onClose();
    };

    const handleCopy = () => {
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = message;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);
        alert("Mensaje copiado al portapapeles");
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Enviar mensaje personalizado</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <p className="mb-4 text-gray-700">
                    Enviando mensaje a: <span className="font-semibold">{guest.name}</span>
                </p>
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe tu mensaje personalizado aquí..."
                    rows={6}
                    className="w-full mb-4 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-600 mt-2">
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
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-lg focus:outline-none flex items-center gap-1"
                    >
                        <Clipboard className="h-4 w-4" />
                        Copiar mensaje
                    </Button>
                    <Button onClick={handleSend} className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg shadow focus:outline-none">
                        Enviar
                    </Button>
                    <Button onClick={onClose} variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-lg focus:outline-none">
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
}
