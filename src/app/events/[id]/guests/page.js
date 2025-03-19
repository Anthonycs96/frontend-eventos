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
import StatsModal from "@/components/StatsModal";
import socket from "@/utils/socket";
import { Plus, Send, MessageSquare, FileText, ChartPie, ChevronRight, Users, CheckCircle, Clock, XCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
    const [isSendInvitationModalOpen, setIsSendInvitationModalOpen] = useState(false);
    const [isCreateContentModalOpen, setIsCreateContentModalOpen] = useState(false);
    const [isSendCustomMessageModalOpen, setIsSendCustomMessageModalOpen] = useState(false);
    const [stats, setStats] = useState(null);
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [invitationContent, setInvitationContent] = useState("");
    const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
    const [showWhatsAppConfig, setShowWhatsAppConfig] = useState(false);

    // Función para obtener estadísticas de invitados
    const fetchGuestStats = async () => {
        try {
            const response = await API.get(`/guest/event/${id}/stats`);
            setStats(response.data);
        } catch (error) {
            console.error("Error al obtener estadísticas de invitados:", error);
        }
    };

    // Función para actualizar un invitado en la lista
    const updateGuestInList = useCallback((updatedGuest) => {
        setGuests(prevGuests => 
            prevGuests.map(guest => 
                guest.id === updatedGuest.id ? { ...guest, ...updatedGuest } : guest
            )
        );
        fetchGuestStats(); // Actualizar estadísticas cuando se actualiza un invitado
    }, [fetchGuestStats]);

    // Función para agregar un nuevo invitado a la lista
    const addGuestToList = useCallback((newGuest) => {
        setGuests(prevGuests => {
            if (!prevGuests.some(guest => guest.id === newGuest.id)) {
                return [...prevGuests, newGuest];
            }
            return prevGuests;
        });
        fetchGuestStats(); // Actualizar estadísticas cuando se agrega un invitado
    }, [fetchGuestStats]);

    // Función para eliminar un invitado de la lista
    const removeGuestFromList = useCallback((guestId) => {
        setGuests(prevGuests => prevGuests.filter(guest => guest.id !== guestId));
        fetchGuestStats(); // Actualizar estadísticas cuando se elimina un invitado
    }, [fetchGuestStats]);

    // Configurar los listeners de socket
    useEffect(() => {
        // Escuchar nuevos invitados
        socket.on("new_Guest", (guest) => {
            console.log("Nuevo invitado recibido:", guest);
            addGuestToList(guest);
        });

        // Escuchar actualizaciones de invitados
        socket.on("update_Guest", (guest) => {
            console.log("Actualización de invitado recibida:", guest);
            updateGuestInList(guest);
        });

        // Escuchar eliminaciones de invitados
        socket.on("delete_Guest", (guestId) => {
            console.log("Eliminación de invitado recibida:", guestId);
            removeGuestFromList(guestId);
        });

        // Limpiar listeners cuando el componente se desmonte
        return () => {
            socket.off("new_Guest");
            socket.off("update_Guest");
            socket.off("delete_Guest");
        };
    }, [addGuestToList, updateGuestInList, removeGuestFromList]);

    // Función para verificar si un invitado ya existe en la lista
    const guestExists = useCallback((guestList, guestId) => {
        return guestList.some((guest) => guest.id === guestId);
    }, []);

    // Función para agregar un nuevo invitado
    const handleAddGuest = useCallback(
        (newGuest) => {
            addGuestToList({ ...newGuest, status: "pending" });
            setIsModalOpen(false);
        },
        [addGuestToList]
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
            removeGuestFromList(guestId);
        } catch (error) {
            console.error("Error al eliminar el invitado:", error);
        }
    }, [removeGuestFromList]);

    // Función para reemplazar un invitado
    const handleReplaceGuest = useCallback((oldGuestId, newGuest) => {
        updateGuestInList({ ...newGuest, id: oldGuestId, status: "pending" });
        setIsReplaceModalOpen(false);
    }, [updateGuestInList]);

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
        updateGuestInList(updatedGuest);
        setIsEditModalOpen(false);
    }, [updateGuestInList]);

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

        // Llamar a las funciones para obtener los datos iniciales
        fetchEventDetails();
        fetchGuests();
        fetchGuestStats(); // Llamar a fetchGuestStats aquí

        // Resto del código...
    }, [id, router, guestExists]);

    // Muestra un indicador de carga mientras se obtienen los datos
    if (loading) return <div>Cargando...</div>;
    // Muestra un mensaje de error si ocurre algún problema al cargar los datos
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Header con breadcrumb y título */}
            <div className="mb-8">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Link href="/dashboard" className="hover:text-blue-600">
                        Eventos
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-gray-900">{eventName || "Cargando..."}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Gestión de Invitados
                </h1>
            </div>

    
            {/* Barra de acciones principales */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
            <div className="flex flex-col sm:flex-row lg:flex-wrap gap-3 sm:gap-4">

                    <Button 
                        onClick={() => setIsModalOpen(true)} 
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Nuevo Invitado
                    </Button>
                    <Button 
                        onClick={() => setIsStatsModalOpen(true)} 
                        className="flex items-center bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        <ChartPie className="mr-2 h-4 w-4" />
                        Estadísticas Detalladas
                    </Button>
                    <div className="flex-grow"></div>
                    <Button 
                        onClick={() => {}}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                            isWhatsAppConnected 
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {isWhatsAppConnected ? "WhatsApp Conectado" : "Conectar WhatsApp"}
                    </Button>
                </div>
            </div>

            {/* Lista de invitados */}
            <div className="bg-stone-50 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
            </div>

            {/* Modales */}
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

            {isStatsModalOpen && (
                <StatsModal 
                    isOpen={isStatsModalOpen}
                    onClose={() => setIsStatsModalOpen(false)}
                    stats={stats}
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