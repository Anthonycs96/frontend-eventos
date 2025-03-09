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
    const [stats, setStats] = useState(null);

    // Estado para gestionar qué invitado está actualmente seleccionado
    const [selectedGuest, setSelectedGuest] = useState(null);

    // Estado para almacenar contenido personalizado de invitaciones
    const [invitationContent, setInvitationContent] = useState("");

    // Estados para manejar la conexión de WhatsApp
    const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
    const [showWhatsAppConfig, setShowWhatsAppConfig] = useState(false);

    const fetchGuestStats = async () => {
        try {
            const response = await API.get(`/guest/event/${id}/stats`);
            setStats(response.data);
        } catch (error) {
            console.error("Error al obtener estadísticas de invitados:", error);
        }
    };

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
                <Button onClick={() => setIsSendInvitationModalOpen(true)} className=" hidden flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Invitaciones
                </Button>
                <Button onClick={() => setIsCreateContentModalOpen(true)} className="hidden  flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Crear Contenido de Invitación
                </Button>

                {/* Botón para conectar/desconectar WhatsApp */}
                <Button onClick={() => setShowWhatsAppConfig(true)}>
                    {isWhatsAppConnected ? "Desconectar WhatsApp" : "Conectar WhatsApp"}
                </Button>
            </div>
            {stats && (
                <Card className="mb-4 bg-white shadow-sm rounded-lg border border-gray-100">
                    <CardHeader className="bg-white p-3 border-b border-gray-100">
                        <CardTitle className="text-base font-semibold text-gray-900 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2 text-gray-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            Estadísticas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 rounded-md bg-gray-50">
                                <p className="text-xs font-medium text-gray-500">Total Invitados</p>
                                <p className="text-base font-bold text-gray-900">{stats.totalGuests}</p>
                            </div>
                            <div className="p-2 rounded-md bg-gray-50">
                                <p className="text-xs font-medium text-gray-500">Confirmados</p>
                                <p className="text-base font-bold text-gray-900">{stats.totalConfirmedGuests}</p>
                            </div>
                            <div className="p-2 rounded-md bg-gray-50">
                                <p className="text-xs font-medium text-gray-500">Acompañantes Confirmados</p>
                                <p className="text-base font-bold text-gray-900">{stats.totalConfirmedAccompanying}</p>
                            </div>
                            <div className="p-2 rounded-md bg-gray-50">
                                <p className="text-xs font-medium text-gray-500">Total Confirmados + Acompañantes</p>
                                <p className="text-base font-bold text-gray-900">{stats.totalConfirmedWithAccompanying}</p>
                            </div>
                            <div className="p-2 rounded-md bg-gray-50">
                                <p className="text-xs font-medium text-gray-500">Pendientes Invitados</p>
                                <p className="text-base font-bold text-gray-900">{stats.totalPendingGuests}</p>
                            </div>
                            <div className="p-2 rounded-md bg-gray-50">
                                <p className="text-xs font-medium text-gray-500">Acompañantes Pendientes</p>
                                <p className="text-base font-bold text-gray-900">{stats.totalPendingAccompanying}</p>
                            </div>
                            <div className="p-2 rounded-md bg-gray-50 col-span-2">
                                <p className="text-xs font-medium text-gray-500">Total Pendientes + Acompañantes</p>
                                <p className="text-base font-bold text-gray-900">{stats.totalPendingWithAccompanying}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}


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