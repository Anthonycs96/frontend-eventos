"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import EventCard from "@/components/EventCard";
import Statistics from "@/components/Statistics";
import CreateEventModal from "@/components/CreateEventModal";
import EditEventModal from "@/components/EditEventModal";
import Button from "@/components/ui/Button";
import API from "@/utils/api";
import socket from "@/utils/socket";
import jwt from 'jsonwebtoken';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    const router = useRouter();

    // 📌 Verifica autenticación
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/"); // Redirige a la página de inicio si no hay token
        } else {
            try {
                const decodedToken = jwt.decode(token);  // Decodifica el JWT
                if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
                    // Si el token ha expirado
                    localStorage.removeItem("token");
                    router.push("/"); // Redirige al inicio
                } else {
                    setIsAuthenticating(false);
                }
            } catch (err) {
                console.error("Error al verificar el token:", err.message);
                localStorage.removeItem("token");
                router.push("/"); // Redirige si hay algún error al decodificar
            }
        }
    }, [router]);

    // 📌 Obtiene solo los eventos creados por el usuario autenticado
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await API.get("/eventUser/created", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Eventos obtenidos:', response.data);
            setEvents(response.data.map((event, index) => ({
                ...event,
                uniqueKey: event.id || index,
            })));
        } catch (err) {
            console.error("❌ Error al obtener eventos:", err.response?.data || err.message);

            // Si el error es 401 (token inválido), redirigir al inicio
            if (err.response && err.response.status === 401) {
                console.log('Token inválido. Redirigiendo al inicio...');
                router.push("/");  // Redirigir a la página de inicio ("/")
            }

            // Si hay otro error relacionado con los eventos, limpiar el localStorage y redirigir
            if (err.response && err.response.data && err.response.data.error === "No se pudieron cargar tus eventos. Intenta nuevamente.") {
                localStorage.clear();  // Limpiar todo el localStorage
                router.push("/"); // Redirigir a la página de inicio
            }

            setError("No se pudieron cargar tus eventos. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    }, [router]);

    // 📌 Carga eventos una vez autenticado
    useEffect(() => {
        if (!isAuthenticating) {
            fetchEvents();

            const handleNewEvent = (newEvent) => {
                setEvents((prevEvents) => {
                    const existingEvent = prevEvents.find((event) => event.id === newEvent.id);
                    return existingEvent
                        ? prevEvents
                        : [...prevEvents, { ...newEvent, uniqueKey: newEvent.id || prevEvents.length }];
                });
            };

            socket.on("new_event", handleNewEvent);

            return () => {
                socket.off("new_event", handleNewEvent);
            };
        }
    }, [fetchEvents, isAuthenticating]);

    // 📌 Calcula estadísticas de eventos
    const { totalInvitations, confirmedInvitations } = useMemo(() => {
        return events.reduce(
            (acc, event) => {
                const { confirmed = 0, pending = 0, rejected = 0 } = event;
                acc.totalInvitations += confirmed + pending + rejected;
                acc.confirmedInvitations += confirmed;
                return acc;
            },
            { totalInvitations: 0, confirmedInvitations: 0 }
        );
    }, [events]);

    // 📌 Elimina un evento
    const deleteEvent = useCallback(async (eventId) => {
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        } catch (err) {
            console.error("❌ Error al eliminar el evento:", err.response?.data || err.message);
        }
    }, []);

    // 📌 Editar un evento
    const handleEditEvent = (event) => {
        setEditEvent(event);
    };

    // 📌 Guardar actualización de evento
    const updateEvent = async (updatedEvent) => {
        try {
            const token = localStorage.getItem("token");
            await API.put(`/events/${updatedEvent.id}`, updatedEvent, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setEvents((prevEvents) =>
                prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
            );

            setEditEvent(null);
        } catch (err) {
            console.error("❌ Error al actualizar el evento:", err.response?.data || err.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard de Eventos</h1>
            </div>

            {loading && <p className="text-gray-500">Cargando eventos...</p>}
            {error && !loading && <p className="text-red-500 text-center">{error}</p>}

            {!loading && !error && (
                <>
                    <Statistics totalEvents={events.length} totalInvitations={totalInvitations} confirmedInvitations={confirmedInvitations} />

                    {events.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {events.map((event) => (
                                <EventCard key={event.uniqueKey} event={event} onDelete={() => deleteEvent(event.id)} onEdit={handleEditEvent} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-8">No hay eventos creados o compartidos contigo.</p>
                    )}
                </>
            )}

            <Button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full">
                Crear Evento
            </Button>

            {isModalOpen && <CreateEventModal onClose={() => setIsModalOpen(false)} onCreateEvent={fetchEvents} />}
            {editEvent && <EditEventModal event={editEvent} onClose={() => setEditEvent(null)} onSave={updateEvent} />}
        </div>
    );
}