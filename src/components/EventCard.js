"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, CheckCircle, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EditEventModal from "@/components/EditEventModal";

export default function EventCard({ event, onDelete, onEdit }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const defaultImageUrl = "https://i.pinimg.com/736x/a9/8f/22/a98f22e917cbea994ca3d1e143d39a20.jpg";

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveChanges = (updatedEvent) => {
        onEdit(updatedEvent);
    };

    return (
        <>
            <Card className="w-full max-w-md mx-auto bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md relative">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={event.imageUrl || defaultImageUrl}
                        alt={event.name}
                        layout="fill"
                        objectFit="cover"
                        className="opacity-20"
                    />
                </div>

                <CardHeader className="p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 flex justify-between items-center rounded-t-2xl relative z-10">
                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                        <span className="mr-2 text-2xl" role="img" aria-label="Celebration emoji">
                            🎉
                        </span>
                        {event.name}
                    </CardTitle>
                    <div className="flex space-x-2">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModal();
                            }}
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors duration-200"
                        >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar evento</span>
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar evento</span>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-4 relative z-10">
                    <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="mr-2 h-4 w-4 text-blue-400" />
                            <span>
                                {new Date(event.date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                            </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="mr-2 h-4 w-4 text-green-400" />
                            <span>{event.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <Badge
                                variant="secondary"
                                className="bg-blue-50 text-blue-600 px-3 py-1 text-xs rounded-full transition-colors duration-200 hover:bg-blue-100"
                            >
                                Confirmados: {event.confirmed}
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="bg-yellow-50 text-yellow-600 px-3 py-1 text-xs rounded-full transition-colors duration-200 hover:bg-yellow-100"
                            >
                                Pendientes: {event.pending}
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="bg-red-50 text-red-600 px-3 py-1 text-xs rounded-full transition-colors duration-200 hover:bg-red-100"
                            >
                                Rechazados: {event.rejected}
                            </Badge>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50/80 rounded-b-2xl relative z-10">
                    <Button
                        variant="ghost"
                        className="flex-1 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                        asChild
                    >
                        <Link href={`/events/${event.id}/guests`} onClick={(e) => e.stopPropagation()}>
                            <Users className="mr-1 h-4 w-4" />
                            Invitados
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        className="flex-1 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                        asChild
                    >
                        <Link href={`/events/${event.id}/confirmations`} onClick={(e) => e.stopPropagation()}>
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Confirmaciones
                        </Link>
                    </Button>
                </CardFooter>
            </Card>

            {isModalOpen && (
                <EditEventModal event={event} isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveChanges} />
            )}
        </>
    );
}
