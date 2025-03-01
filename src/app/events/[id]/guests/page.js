"use client";

// Importamos hooks de React y Next.js, así como componentes y utilidades necesarias
import { useParams, useRouter } from "next/navigation"; // Agregamos useRouter para redirección
import { useEffect, useState, useCallback } from "react";
import API from "@/utils/api";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GuestList from "@/components/GuestList";
import ReplaceGuestModal from "@/components/ReplaceGuestModal";
import AddGuestModal from "@/components/AddGuestModal";
import CreateInvitationContentModal from "@/components/CreateInvitationContentModal";
import SendCustomMessageModal from "@/components/SendCustomMessageModal";
import EditGuestModal from "@/components/EditGuestModal";
import WhatsAppIntegration from "@/components/WhatsAppIntegration";
import socket from "@/utils/socket";
import { Plus, Send, MessageSquare, FileText } from "lucide-react";

// Componente principal para la gestión de invitados
export default function GuestManagement() {
    // Extraemos el ID del evento desde los parámetros de la URL
    const { id } = useParams();
    const router = useRouter(); // Para redirigir si no está autenticado

    // Definimos estados para almacenar datos de invitados, el nombre del evento y gestionar el estado de carga o error
    const [guests, setGuests] = useState([]);
    const [eventName, setEventName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para controlar la visibilidad de los diferentes modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
    const [isSendInvitationModalOpen, setIsSendInvitationModalOpen] = useState(false);
    const [isCreateContentModalOpen, setIsCreateContentModalOpen] = useState(false);
    const [isSendCustomMessageModalOpen, setIsSendCustomMessageModalOpen] = useState(false);

    // Estado para gestionar qué invitado está actualmente seleccionado
    const [selectedGuest, setSelectedGuest] = useState(null);

    // Estado para almacenar contenido personalizado de invitaciones
    const [invitationContent, setInvitationContent] = useState("");

    // Estados para manejar la conexión de WhatsApp
    const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
    const [showWhatsAppConfig, setShowWhatsAppConfig] = useState(false);

    // Función para verificar si un invitado ya existe en la lista
    const guestExists = useCallback((guestList, guestId) => {
        return guestList.some((guest) => guest.id === guestId);
    }, []);

    // Función para agregar un nuevo invitado
    const handleAddGuest = useCallback(
        (newGuest) => {
            setGuests((prevGuests) => {
                if (!guestExists(prevGuests, newGuest.id)) {
                    return [...prevGuests, { ...newGuest, status: "pending" }];
                }
                return prevGuests;
            });
            setIsModalOpen(false);
        },
        [guestExists]
    );

    // Función para editar un invitado
    const handleEditGuest = useCallback((guest) => {
        setSelectedGuest(guest);
        setIsEditModalOpen(true);
    }, []);

    // Función para eliminar un invitado
    const handleDeleteGuest = useCallback(async (guestId) => {
        try {
            await API.delete(`/guest/delete/${guestId}`);
            setGuests((prevGuests) => prevGuests.filter((guest) => guest.id !== guestId));
        } catch (error) {
            console.error("Error al eliminar el invitado:", error);
        }
    }, []);

    // Función para reemplazar un invitado
    const handleReplaceGuest = useCallback((oldGuestId, newGuest) => {
        setGuests((prevGuests) =>
            prevGuests.map((guest) =>
                guest.id === oldGuestId ? { ...newGuest, id: oldGuestId, status: "pending" } : guest
            )
        );
        setIsReplaceModalOpen(false);
    }, []);

    // Función para guardar el contenido de la invitación
    const handleSaveInvitationContent = useCallback((content) => {
        setInvitationContent(content);
        setIsCreateContentModalOpen(false);
    }, []);

    // Función para enviar un mensaje personalizado
    const handleSendCustomMessage = useCallback(async (guest, text) => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                console.error("No se encontró el userId en localStorage.");
                return;
            }
            const formattedPhone = guest.phone.replace(/^\+/, "");
            await API.post(`/whatsapp/send`, {
                userId,
                phone: formattedPhone,
                text: text,
            });
            console.log("Mensaje enviado correctamente");
            setIsSendCustomMessageModalOpen(false);
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        }
    }, []);

    // Función para actualizar un invitado
    const handleUpdateGuest = useCallback((updatedGuest) => {
        setGuests((prevGuests) =>
            prevGuests.map((guest) =>
                guest.id === updatedGuest.id ? { ...guest, ...updatedGuest } : guest
            )
        );
        setIsEditModalOpen(false);
    }, []);

    // useEffect se ejecuta al montar el componente o cuando cambia el ID del evento
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("No se encontró el userId en localStorage.");
            return;
        }

        // Función para cargar detalles del evento
        const fetchEventDetails = async () => {
            try {
                const response = await API.get(`/events/${id}`);
                setEventName(response.data.name);
            } catch (err) {
                console.error("Error al cargar el nombre del evento:", err);
                setError("No se pudo cargar el nombre del evento.");
                if (err.response?.status === 500) {
                    router.push("/dashboard");
                }
            }
        };

        // Función para cargar la lista de invitados
        const fetchGuests = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/guest/${id}`);
                setGuests(response.data.map((guest) => ({ ...guest, status: guest.status || "pending" })));
            } catch (err) {
                console.error("No se pudieron cargar los invitados:", err);
                setError("No se pudieron cargar los invitados.");
            } finally {
                setLoading(false);
            }
        };

        // Función para verificar la conexión de WhatsApp
        const checkWhatsAppConnection = async () => {
            try {
                const response = await API.get("/whatsapp/status", { params: { userId } });
                setIsWhatsAppConnected(response.data.isConnected);
            } catch (err) {
                console.error("Error al verificar la conexión de WhatsApp:", err);
                setIsWhatsAppConnected(false);
            }
        };

        // Escuchar eventos de actualización de invitados en tiempo real
        const handleSocketUpdateGuest = (updatedGuest) => {
            console.log("🔄 Recibida actualización desde el socket:", updatedGuest);
            setGuests((prevGuests) =>
                prevGuests.map((guest) =>
                    guest.id === updatedGuest.id ? { ...guest, ...updatedGuest } : guest
                )
            );
        };

        const handleSocketNewGuest = (newGuest) => {
            console.log("🆕 Nuevo invitado recibido desde el socket:", newGuest);
            setGuests((prevGuests) => {
                if (!guestExists(prevGuests, newGuest.id)) {
                    return [...prevGuests, { ...newGuest, status: "pending" }];
                }
                return prevGuests;
            });
        };

        // Suscribirse a los eventos del socket
        socket.on("update_Guest", handleSocketUpdateGuest);
        socket.on("new_Guest", handleSocketNewGuest);

        // Llamar a las funciones para obtener los datos iniciales
        fetchEventDetails();
        fetchGuests();
        checkWhatsAppConnection();

        // Cleanup: eliminar la suscripción al desmontar el componente
        return () => {
            socket.off("update_Guest", handleSocketUpdateGuest);
            socket.off("new_Guest", handleSocketNewGuest);
        };
    }, [id, router, guestExists]);

    // Muestra un indicador de carga mientras se obtienen los datos
    if (loading) return <div>Cargando...</div>;
    // Muestra un mensaje de error si ocurre algún problema al cargar los datos
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto px-4">
            {/* Encabezado de la página */}
            <h1 className="text-3xl font-bold mb-8">
                Gestión de Invitados - <span className="text-blue-500">{eventName || "Cargando..."}</span>
            </h1>

            {/* Botones para abrir los diferentes modales */}
            <div className="mb-6 flex flex-wrap gap-4">
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Nuevo Invitado
                </Button>
                <Button onClick={() => setIsSendInvitationModalOpen(true)} className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Invitaciones
                </Button>
                <Button onClick={() => setIsCreateContentModalOpen(true)} className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Crear Contenido de Invitación
                </Button>

                {/* Botón para conectar/desconectar WhatsApp */}
                <Button onClick={() => setShowWhatsAppConfig(true)}>
                    {isWhatsAppConnected ? "Desconectar WhatsApp" : "Conectar WhatsApp"}
                </Button>
            </div>

            {/* Lista de invitados */}
            <GuestList
                guests={guests}
                onEdit={handleEditGuest}
                onDelete={handleDeleteGuest}
                onReplace={(guest) => {
                    setSelectedGuest(guest);
                    setIsReplaceModalOpen(true);
                }}
                onSendInvitation={(guest) => {
                    setSelectedGuest(guest);
                    setIsSendInvitationModalOpen(true);
                }}
                onSendCustomMessage={(guest) => {
                    setSelectedGuest(guest);
                    setIsSendCustomMessageModalOpen(true);
                }}
            />

            {/* Modales para agregar, editar y gestionar invitados */}
            {isModalOpen && (
                <AddGuestModal
                    onClose={() => setIsModalOpen(false)}
                    onAddGuest={handleAddGuest}
                    eventId={id}
                    guest={selectedGuest}
                />
            )}

            {isEditModalOpen && selectedGuest && (
                <EditGuestModal
                    guest={selectedGuest}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleUpdateGuest}
                />
            )}

            {isReplaceModalOpen && selectedGuest && (
                <ReplaceGuestModal
                    guest={selectedGuest}
                    onClose={() => setIsReplaceModalOpen(false)}
                    onReplaceGuest={handleReplaceGuest}
                />
            )}

            {isCreateContentModalOpen && (
                <CreateInvitationContentModal
                    onClose={() => setIsCreateContentModalOpen(false)}
                    onSave={handleSaveInvitationContent}
                />
            )}

            {isSendCustomMessageModalOpen && selectedGuest && (
                <SendCustomMessageModal
                    guest={selectedGuest}
                    onClose={() => setIsSendCustomMessageModalOpen(false)}
                    onSend={handleSendCustomMessage}
                />
            )}

            {/* Modal de integración de WhatsApp */}
            {showWhatsAppConfig && (
                <WhatsAppIntegration
                    isOpen={showWhatsAppConfig}
                    onClose={() => setShowWhatsAppConfig(false)}
                    isConnected={isWhatsAppConnected}
                    onConnectionChange={setIsWhatsAppConnected}
                    userId={localStorage.getItem("userId")}
                />
            )}
        </div>
    );
}