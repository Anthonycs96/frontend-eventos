"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import Label from "@/components/ui/label";
import API from "@/utils/api";
import { ImprovedCarousel } from "@/components/ui/SimpleCarousel";

export default function EditEventModal({ event, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        date: "",
        time: "",
        location: "",
        capacity: "",
        type: "private",
        isActive: true,
        songUrl: "",
        imageUrl: "",
        secondaryImages: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (event) {
            setFormData({
                name: event.name || "",
                description: event.description || "",
                date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
                time: event.time || "",
                location: event.location || "",
                capacity: event.capacity || "",
                type: event.type || "private",
                isActive: event.isActive ?? true,
                songUrl: event.songUrl || "",
                imageUrl: event.imageUrl || "",
                secondaryImages: event?.secondaryImages || [],
            });
        }
    }, [event]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }, []);

    const handleSecondaryImagesChange = useCallback((index, value) => {
        setFormData((prev) => {
            const newImages = [...prev.secondaryImages];
            newImages[index] = value;
            return { ...prev, secondaryImages: newImages };
        });
    }, []);

    const handleAddSecondaryImage = useCallback((e) => {
        e.preventDefault();
        setFormData((prev) => ({
            ...prev,
            secondaryImages: [...prev.secondaryImages, ""],
        }));
    }, []);

    const handleRemoveSecondaryImage = useCallback((index, e) => {
        e.preventDefault();
        setFormData((prev) => ({
            ...prev,
            secondaryImages: prev.secondaryImages.filter((_, i) => i !== index),
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            await API.put(`/events/${event.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onSave({ ...event, ...formData });
            onClose();
        } catch (err) {
            console.error("Error al actualizar evento:", err.response?.data || err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Obtener miniatura de YouTube si la imagen es un enlace de video
    const getYouTubeThumbnail = (url) => {
        try {
            const videoId = new URL(url).searchParams.get("v");
            return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : url;
        } catch {
            return url;
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[90%] md:max-w-[700px] max-h-[90vh] bg-white overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Evento</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Sección de campos de texto */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full mt-1 p-2 border rounded-lg"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                                    <input
                                        type="date"
                                        name="date"
                                        className="w-full mt-1 p-2 border rounded-lg"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hora</label>
                                    <input
                                        type="time"
                                        name="time"
                                        className="w-full mt-1 p-2 border rounded-lg"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Campos adicionales */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                                <input
                                    type="text"
                                    name="location"
                                    className="w-full mt-1 p-2 border rounded-lg"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Capacidad</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    className="w-full mt-1 p-2 border rounded-lg"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                <select
                                    name="type"
                                    className="w-full mt-1 p-2 border rounded-lg"
                                    value={formData.type}
                                    onChange={handleChange}
                                >
                                    <option value="private">Privado</option>
                                    <option value="public">Público</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    className="mr-2"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                <label className="text-sm font-medium text-gray-700">Evento Activo</label>
                            </div>
                        </div>
                    </div>
                    {/* Sección de URLs de musica */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL de la Imagen Musica Fondo</label>
                        <input
                            type="text"
                            name="songUrl"
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={formData.songUrl}
                            onChange={handleChange}
                        />
                    </div>
                    {/* URL de la Imagen Principal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL de la Imagen Principal</label>
                        <input
                            type="text"
                            name="imageUrl"
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={formData.imageUrl}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Vista previa de la Imagen Principal */}
                    {formData.imageUrl && (
                        <div className="mt-4">
                            <Label>Vista previa de la imagen principal</Label>
                            <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden">
                                <img
                                    src={getYouTubeThumbnail(formData.imageUrl)}
                                    alt="Vista previa del evento"
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            </div>
                        </div>
                    )}

                    {/* URLs de Imágenes Secundarias */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URLs de Imágenes Secundarias</label>
                        <div className="space-y-2">
                            {formData.secondaryImages.map((url, index) => (
                                <div key={index} className="flex space-x-2">
                                    <input
                                        type="text"
                                        className="flex-1 p-2 border rounded-lg"
                                        value={url}
                                        onChange={(e) => handleSecondaryImagesChange(index, e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemoveSecondaryImage(index, e)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddSecondaryImage}
                            className="mt-2 text-blue-600 hover:underline"
                        >
                            Añadir URL
                        </button>
                    </div>

                    {/* Vista previa de imágenes secundarias */}
                    {formData.secondaryImages.length > 0 && (
                        <div className="mt-4">
                            <Label>Vista previa de imágenes secundarias</Label>
                            <ImprovedCarousel images={formData.secondaryImages} />
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
