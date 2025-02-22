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

    // useEffect se ejecuta al montar el componente o cuando cambia el ID del evento
    useEffect(() => {
        // Verificar si el usuario está autenticado
        const userId = localStorage.getItem("userId");

        if (!userId) {
            console.error("No se encontró el userId en localStorage.");
            return;
        }

        // Función para cargar detalles del evento
        const fetchEventDetails = async () => {
            try {
                // Petición a la API para obtener el nombre del evento
                const response = await API.get(`/events/${id}`);
                setEventName(response.data.name);
            } catch (err) {
                console.error("Error al cargar el nombre del evento:", err);
                setError("No se pudo cargar el nombre del evento.");
                // Si el error es un 500, redirige a /dashboard
                if (err.response && err.response.status === 500) {
                    router.push("/dashboard");
                }
            } finally {
                setLoading(false);
            }
        };

        // Función para cargar la lista de invitados
        const fetchGuests = async () => {
            try {
                setLoading(true);
                // Petición a la API para obtener la lista de invitados
                const response = await API.get(`/guest/${id}`);
                // Actualizamos el estado con la lista de invitados
                setGuests(response.data.map((guest) => ({ ...guest, status: guest.status || "pending" })));
            } catch (err) {
                console.error("No se pudieron cargar los invitados:", err);
                setError("No se pudieron cargar los invitados.");
            } finally {
                setLoading(false);
            }
        };

        // Función para verificar la conexión de WhatsApp con el backend
        const checkWhatsAppConnection = async () => {
            try {
                const userId = localStorage.getItem("userId"); // Captura el userId desde localStorage
                if (!userId) {
                    console.log('hey:' + userId)
                    console.error("No se encontró el userId en localStorage.");
                    setIsWhatsAppConnected(false);
                    return;
                }

                // Envía el userId como parámetro en la solicitud
                const response = await API.get("/whatsapp/status", {
                    params: { userId }, // Envía el userId como query parameter
                });

                // Actualiza el estado de conexión
                setIsWhatsAppConnected(response.data.isConnected);
            } catch (err) {
                console.error("Error al verificar la conexión de WhatsApp:", err);
                setIsWhatsAppConnected(false);
            }
        };

        // Llamamos a las funciones para obtener los datos iniciales
        fetchEventDetails();
        fetchGuests();
        checkWhatsAppConnection(); // Verificar la conexión de WhatsApp
    }, [id, router]);

    // Función para agregar un nuevo invitado
    const handleAddGuest = useCallback((newGuest) => {
        // Actualizamos el estado de invitados con el nuevo invitado
        setGuests((prevGuests) => [...prevGuests, { ...newGuest, status: "pending" }]);
        // Cerramos el modal de agregar invitado
        setIsModalOpen(false);
    }, []);

    // Función para editar un invitado
    const handleEditGuest = (guest) => {
        // Seleccionamos al invitado que se va a editar y abrimos el modal de edición
        setSelectedGuest(guest);
        setIsEditModalOpen(true);
    };

    // Función para eliminar un invitado
    const handleDeleteGuest = async (guestId) => {
        try {
            // Petición a la API para eliminar un invitado por su ID
            await API.delete(`/guest/delete/${guestId}`);
            // Actualizamos el estado eliminando al invitado de la lista
            setGuests((prevGuests) => prevGuests.filter((guest) => guest.id !== guestId));
        } catch (error) {
            console.error("Error al eliminar el invitado:", error);
        }
    };

    // Función para reemplazar un invitado
    const handleReplaceGuest = (oldGuestId, newGuest) => {
        // Actualizamos la lista de invitados, reemplazando al invitado antiguo con el nuevo
        setGuests((prevGuests) =>
            prevGuests.map((guest) => (guest.id === oldGuestId ? { ...newGuest, id: oldGuestId, status: "pending" } : guest))
        );
        setIsReplaceModalOpen(false);
    };

    // Función para guardar el contenido de la invitación
    const handleSaveInvitationContent = (content) => {
        setInvitationContent(content);
        setIsCreateContentModalOpen(false);
    };

    // Función para enviar un mensaje personalizado
    const handleSendCustomMessage = async (guest, text) => {
        try {
            // Obtener el userId desde localStorage
            const userId = localStorage.getItem("userId");

            if (!userId) {
                console.error("No se encontró el userId en localStorage.");
                return;
            }
            // Remover el símbolo "+" del número de teléfono
            const formattedPhone = guest.phone.replace(/^\+/, "");

            // Realizar la petición POST al endpoint de tu API
            const response = await API.post(`/whatsapp/send`, {
                userId,
                phone: formattedPhone,
                text: text,
            });

            // Puedes manejar la respuesta aquí si es necesario
            console.log("Mensaje enviado correctamente:", response.data);

            // Cerrar el modal después de enviar el mensaje
            setIsSendCustomMessageModalOpen(false);
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
            // Opcional: manejar el error, por ejemplo, mostrar un mensaje de error
        }
    };

    // Función para manejar la edición/actualización de un invitado
    const handleUpdateGuest = async (updatedGuest) => {
        try {
            // Petición PUT para actualizar el invitado en el backend
            await API.put(`/guest/guest/${updatedGuest.id}`, updatedGuest);

            // Actualizar la lista de invitados en el estado local
            setGuests((prevGuests) =>
                prevGuests.map((guest) =>
                    guest.id === updatedGuest.id ? updatedGuest : guest
                )
            );

            // Cerrar el modal de edición
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error al actualizar el invitado:", error);
        }
    };

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
                onEdit={(guest) => handleEditGuest(guest)}
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

            {/* Modal de edición */}
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

            {isSendInvitationModalOpen && (
                <SendInvitationModal
                    onClose={() => setIsSendInvitationModalOpen(false)}
                    eventId={id}
                    guest={selectedGuest}
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
                    userId={localStorage.getItem("userId")} // Pasamos el userId
                />
            )}

        </div>
    );
}