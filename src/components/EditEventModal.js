import { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import Label from "@/components/ui/label";
import API from "@/utils/api";
import { ImprovedCarousel } from "@/components/ui/SimpleCarousel";
import { toast } from "react-hot-toast";
import socket from "@/utils/socket";

export default function EditEventModal({ event, onClose }) {
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

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingImages, setLoadingImages] = useState({});

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

    const validateForm = useCallback(() => {
        const newErrors = {};
        const currentDate = new Date();
        const selectedDate = new Date(formData.date);

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido";
        }

        if (!formData.description.trim()) {
            newErrors.description = "La descripción es requerida";
        }

        if (!formData.date) {
            newErrors.date = "La fecha es requerida";
        } else if (selectedDate < currentDate) {
            newErrors.date = "La fecha no puede ser anterior a hoy";
        }

        if (!formData.time) {
            newErrors.time = "La hora es requerida";
        }

        if (!formData.location.trim()) {
            newErrors.location = "La ubicación es requerida";
        }

        if (!formData.capacity || formData.capacity <= 0) {
            newErrors.capacity = "La capacidad debe ser mayor a 0";
        }

        if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
            newErrors.imageUrl = "URL de imagen principal inválida";
        }

        if (formData.songUrl && !isValidUrl(formData.songUrl)) {
            newErrors.songUrl = "URL de música inválida";
        }

        formData.secondaryImages.forEach((url, index) => {
            if (url && !isValidUrl(url)) {
                newErrors[`secondaryImage${index}`] = "URL de imagen secundaria inválida";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const isValidUrl = useCallback((string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Limpiar error cuando el usuario modifica el campo
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }, []);

    const handleSecondaryImagesChange = useCallback((index, value) => {
        setFormData((prev) => {
            const newImages = [...prev.secondaryImages];
            newImages[index] = value;
            return { ...prev, secondaryImages: newImages };
        });
        setErrors((prev) => ({ ...prev, [`secondaryImage${index}`]: undefined }));
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
        if (window.confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
            setFormData((prev) => ({
                ...prev,
                secondaryImages: prev.secondaryImages.filter((_, i) => i !== index),
            }));
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[`secondaryImage${index}`];
                return newErrors;
            });
        }
    }, []);

    const getYouTubeThumbnail = useMemo(() => (url) => {
        try {
            const videoId = new URL(url).searchParams.get("v");
            return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : url;
        } catch {
            return url;
        }
    }, []);

    const handleImageLoad = useCallback((imageKey) => {
        setLoadingImages((prev) => ({ ...prev, [imageKey]: false }));
    }, []);

    const handleImageError = useCallback((imageKey) => {
        setLoadingImages((prev) => ({ ...prev, [imageKey]: false }));
        setErrors((prev) => ({ ...prev, [imageKey]: "Error al cargar la imagen" }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const isValid = validateForm();
        if (!isValid) {
            toast.error("Por favor, corrige los errores en el formulario");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se encontró el token de autenticación");
            }

            const response = await API.put(`/events/${event.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Emitir evento de actualización
            socket.emit("update_Guest", response.data);


            toast.success("Evento actualizado exitosamente");
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            toast.error(`Error al actualizar evento: ${errorMessage}`);
            console.error("Error al actualizar evento:", errorMessage);
        } finally {
            setIsSubmitting(false);
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
                                    className={`w-full mt-1 p-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                                    <input
                                        type="date"
                                        name="date"
                                        className={`w-full mt-1 p-2 border rounded-lg ${errors.date ? 'border-red-500' : ''}`}
                                        value={formData.date}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hora</label>
                                    <input
                                        type="time"
                                        name="time"
                                        className={`w-full mt-1 p-2 border rounded-lg ${errors.time ? 'border-red-500' : ''}`}
                                        value={formData.time}
                                        onChange={handleChange}
                                    />
                                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                                <input
                                    type="text"
                                    name="location"
                                    className={`w-full mt-1 p-2 border rounded-lg ${errors.location ? 'border-red-500' : ''}`}
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Capacidad</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    className={`w-full mt-1 p-2 border rounded-lg ${errors.capacity ? 'border-red-500' : ''}`}
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    min="1"
                                />
                                {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
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
                        <label className="block text-sm font-medium text-gray-700">URL de la Música de Fondo</label>
                        <input
                            type="text"
                            name="songUrl"
                            className={`w-full mt-1 p-2 border rounded-lg ${errors.songUrl ? 'border-red-500' : ''}`}
                            value={formData.songUrl}
                            onChange={handleChange}
                        />
                        {errors.songUrl && <p className="text-red-500 text-xs mt-1">{errors.songUrl}</p>}
                    </div>

                    {/* URL de la Imagen Principal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL de la Imagen Principal</label>
                        <input
                            type="text"
                            name="imageUrl"
                            className={`w-full mt-1 p-2 border rounded-lg ${errors.imageUrl ? 'border-red-500' : ''}`}
                            value={formData.imageUrl}
                            onChange={handleChange}
                        />
                        {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
                    </div>

                    {/* Vista previa de la Imagen Principal */}
                    {formData.imageUrl && (
                        <div className="mt-4">
                            <Label>Vista previa de la imagen principal</Label>
                            <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden">
                                {loadingImages.mainImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <span className="text-gray-500">Cargando...</span>
                                    </div>
                                )}
                                <img
                                    src={getYouTubeThumbnail(formData.imageUrl)}
                                    alt="Vista previa del evento"
                                    className="w-full h-full object-cover"
                                    onLoad={() => handleImageLoad('mainImage')}
                                    onError={() => handleImageError('mainImage')}
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
                                        className={`flex-1 p-2 border rounded-lg ${
                                            errors[`secondaryImage${index}`] ? 'border-red-500' : ''
                                        }`}
                                        value={url}
                                        onChange={(e) => handleSecondaryImagesChange(index, e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemoveSecondaryImage(index, e)}
                                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                    {errors[`secondaryImage${index}`] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[`secondaryImage${index}`]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddSecondaryImage}
                            className="mt-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            Añadir URL
                        </button>
                    </div>

                    {/* Vista previa de imágenes secundarias */}
                    {formData.secondaryImages.length > 0 && (
                        <div className="mt-4">
                            <Label>Vista previa de imágenes secundarias</Label>
                            <ImprovedCarousel 
                                images={formData.secondaryImages} 
                                onImageLoad={(index) => handleImageLoad(`secondary${index}`)}
                                onImageError={(index) => handleImageError(`secondary${index}`)}
                            />
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
