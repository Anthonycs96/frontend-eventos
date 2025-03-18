"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, CheckCircle, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EditEventModal from "@/components/EditEventModal";

export default function EventCard({ event, onDelete }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const router = useRouter();
    const defaultImageUrl = "https://i.pinimg.com/736x/a9/8f/22/a98f22e917cbea994ca3d1e143d39a20.jpg";

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleNavigation = (path) => {
        if (isNavigating) return;
        setIsNavigating(true);
        router.push(path);
    };

    return (
        <>
            <Card className="w-full md:max-w-md lg:max-w-lg mx-auto bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg relative group">
                {/* Imagen de fondo con efecto hover */}
                <div className="absolute inset-0 z-0 transition-opacity duration-300">
                    <Image
                        src={event.imageUrl || defaultImageUrl}
                        alt={event.name}
                        layout="fill"
                        objectFit="cover"
                        className="opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                        priority
                    />
                </div>

                {/* Header con título y acciones */}
                <CardHeader className="p-4 md:p-5 bg-gradient-to-r from-blue-50/90 to-purple-50/90 flex justify-between items-center rounded-t-2xl relative z-10">
                    <CardTitle className="text-lg md:text-xl font-semibold text-gray-800 flex items-center truncate pr-2">
                        <span className="mr-2 text-xl md:text-2xl flex-shrink-0" role="img" aria-label="Celebration emoji">
                            🎉
                        </span>
                        <span className="truncate">{event.name}</span>
                    </CardTitle>
                    <div className="flex space-x-1 md:space-x-2 flex-shrink-0">
                        <Button
                            onClick={handleOpenModal}
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200 p-1.5 md:p-2"
                        >
                            <Edit className="h-4 w-4 md:h-5 md:w-5" />
                            <span className="sr-only">Editar evento</span>
                        </Button>
                        <Button
                            onClick={onDelete}
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 p-1.5 md:p-2"
                        >
                            <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                            <span className="sr-only">Eliminar evento</span>
                        </Button>
                    </div>
                </CardHeader>

                {/* Contenido principal */}
                <CardContent className="p-4 md:p-5 relative z-10 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="mr-2 h-4 w-4 text-blue-400 flex-shrink-0" />
                            <span className="truncate">
                                {new Date(event.date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                            </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="mr-2 h-4 w-4 text-green-400 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    </div>

                    {/* Badges de estado */}
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-600 px-3 py-1 text-xs rounded-full transition-all duration-200 hover:bg-blue-100 hover:scale-105"
                        >
                            <span className="hidden md:inline">Confirmados:</span>
                            <span className="md:hidden">👍</span>
                            {" "}{event.confirmed}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="bg-yellow-50 text-yellow-600 px-3 py-1 text-xs rounded-full transition-all duration-200 hover:bg-yellow-100 hover:scale-105"
                        >
                            <span className="hidden md:inline">Pendientes:</span>
                            <span className="md:hidden">⏳</span>
                            {" "}{event.pending}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="bg-red-50 text-red-600 px-3 py-1 text-xs rounded-full transition-all duration-200 hover:bg-red-100 hover:scale-105"
                        >
                            <span className="hidden md:inline">Rechazados:</span>
                            <span className="md:hidden">👎</span>
                            {" "}{event.rejected}
                        </Badge>
                    </div>
                </CardContent>

                {/* Footer con botones de acción */}
                <CardFooter className="flex flex-wrap items-center justify-between gap-2 p-3 md:p-4 bg-gray-50/90 rounded-b-2xl relative z-10">
                    <Button
                        variant="ghost"
                        className={`flex-1 text-xs md:text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 py-2 md:py-2.5 ${
                            isNavigating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                        }`}
                        onClick={() => handleNavigation(`/events/${event.id}/guests`)}
                        disabled={isNavigating}
                    >
                        <Users className="mr-1 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="truncate">
                            {isNavigating ? 'Cargando...' : 'Invitados'}
                        </span>
                    </Button>

                    <Button
                        variant="ghost"
                        className={`flex-1 text-xs md:text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 py-2 md:py-2.5 ${
                            isNavigating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                        }`}
                        onClick={() => handleNavigation(`/events/${event.id}/confirmations`)}
                        disabled={isNavigating}
                    >
                        <CheckCircle className="mr-1 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="truncate">
                            {isNavigating ? 'Cargando...' : 'Confirmaciones'}
                        </span>
                    </Button>
                </CardFooter>
            </Card>

            {isModalOpen && (
                <EditEventModal event={event} onClose={handleCloseModal} />
            )}
        </>
    );
}
