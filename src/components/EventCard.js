"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, CheckCircle, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EditEventModal from "@/components/EditEventModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function EventCard({ event, onDelete, stats }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const router = useRouter();
    const defaultImageUrl = "https://i.pinimg.com/736x/a9/8f/22/a98f22e917cbea994ca3d1e143d39a20.jpg";

    console.log(stats);

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

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        onDelete();
        setIsDeleteDialogOpen(false);
    };

    return (
        <>
            <Card className="w-full mb-10 md:mb-10 md:max-w lg:max-w mx-auto shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 relative group">
                {/* Imagen de fondo con gradiente */}
                <div className="relative h-16 sm:h-16 overflow-hidden">
                    <Image
                        src={event.imageUrl || defaultImageUrl}
                        alt={event.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10"></div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <Button
                            onClick={handleOpenModal}
                            variant="ghost"
                            size="icon"
                            className="bg-white/80 hover:bg-white text-gray-700 hover:text-blue-600 rounded-full transition-all duration-200 p-2"
                        >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar evento</span>
                        </Button>
                        <Button
                            onClick={handleDeleteClick}
                            variant="ghost"
                            size="icon"
                            className="bg-white/80 hover:bg-white text-gray-700 hover:text-red-600 rounded-full transition-all duration-200 p-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar evento</span>
                        </Button>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-5 space-y-4">
                    {/* Título y fecha */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <span role="img" aria-label="Celebration emoji">🎉</span>
                            {event.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                            {new Date(event.date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                        </div>
                    </div>

                    {/* Ubicación */}
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                        <MapPin className="mr-2 h-4 w-4 text-green-500" />
                        <span className="truncate">{event.location}</span>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-4 gap-1 pt-2">
                        <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
                            <span className="text-lg font-semibold text-blue-600">
                                {stats?.totalConfirmedWithAccompanying || 0}
                            </span>
                            <span className="text-xs text-blue-600">Total confirmados</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-lg">
                            <span className="text-lg font-semibold text-yellow-600">
                                {stats?.totalPendingWithAccompanying || 0}
                            </span>
                            <span className="text-xs text-yellow-600">Total pendientes</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-red-50 rounded-lg">
                            <span className="text-lg font-semibold text-red-600">
                                {stats?.totalDeclinedWithAccompanying || 0}
                            </span>
                            <span className="text-xs text-red-600">Total rechazados</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
                            <span className="text-lg font-semibold text-green-600">
                                {stats?.totalGuests || 0}
                            </span>
                            <span className="text-xs text-green-600">Total invitados</span>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="p-4 bg-gray-50 flex gap-2">
                    <Button
                        variant="ghost"
                        className={`flex-1 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl transition-all duration-200 ${isNavigating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                            }`}
                        onClick={() => handleNavigation(`/events/${event.id}/guests`)}
                        disabled={isNavigating}
                    >
                        <Users className="mr-2 h-4 w-4" />
                        <span className="text-sm">
                            {isNavigating ? 'Cargando...' : 'Invitados'}
                        </span>
                    </Button>

                    <Button
                        variant="ghost"
                        className={`flex-1 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl transition-all duration-200 opacity-50 cursor-not-allowed`}
                        onClick={() => { }}
                        disabled={true}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span className="text-sm">
                            Confirmaciones
                        </span>
                    </Button>
                </div>
            </Card>

            {isModalOpen && (
                <EditEventModal event={event} onClose={handleCloseModal} />
            )}

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            ¿Estás seguro de eliminar este evento?
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600">
                        Esta acción no se puede deshacer. El evento será eliminado permanentemente.
                    </p>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
