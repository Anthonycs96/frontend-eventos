"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Button from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"

export default function CreateInvitationContentModal({ onClose, onSave }) {
    const [content, setContent] = useState("")

    const handleSave = () => {
        onSave(content)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Crear Contenido de Invitación</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Escribe el contenido de la invitación aquí..."
                    rows={6}
                    className="w-full mb-4"
                />
                <div className="flex justify-end">
                    <Button onClick={handleSave} className="mr-2">
                        Guardar
                    </Button>
                    <Button onClick={onClose} variant="outline">
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    )
}

