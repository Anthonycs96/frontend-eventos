"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import API from "@/utils/api";

export default function CreateEventModal({ onClose, onCreateEvent }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [type, setType] = useState("private");
    const [isActive, setIsActive] = useState(true);
    const [imageUrl, setImageUrl] = useState("");
    const [songUrl, setSongUrl] = useState(""); // 🎵 Nueva URL de la canción
    const [secondaryImages, setSecondaryImages] = useState([]); // 🖼️ Imágenes secundarias
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // Obtener userId desde localStorage
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setError("No se encontró el ID de usuario. Inicia sesión nuevamente.");
        }
    }, []);

    // Agregar una nueva imagen secundaria
    const handleAddSecondaryImage = () => {
        setSecondaryImages([...secondaryImages, ""]);
    };

    // Actualizar una imagen secundaria
    const handleUpdateSecondaryImage = (index, value) => {
        const updatedImages = [...secondaryImages];
        updatedImages[index] = value;
        setSecondaryImages(updatedImages);
    };

    // Eliminar una imagen secundaria
    const handleRemoveSecondaryImage = (index) => {
        const updatedImages = secondaryImages.filter((_, i) => i !== index);
        setSecondaryImages(updatedImages);
    };

    // Función para validar URLs correctamente
    const isValidURL = (url) => {
        if (!url || url.trim() === "") return true; // Permitir valores vacíos
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!userId) {
            setError("No se puede crear un evento sin un usuario autenticado.");
            return;
        }

        // Validaciones antes de enviar
        if (!name.trim()) {
            setError("El nombre del evento es obligatorio.");
            return;
        }
        if (!location.trim()) {
            setError("La ubicación es obligatoria.");
            return;
        }
        if (!description.trim()) {
            setError("La descripción es obligatoria.");
            return;
        }
        if (!date) {
            setError("La fecha del evento es obligatoria.");
            return;
        }
        if (!time) {
            setError("La hora del evento es obligatoria.");
            return;
        }

        // Validar que la fecha y la hora sean futuras
        const eventDateTime = new Date(`${date}T${time}`);
        const currentDateTime = new Date();
        if (eventDateTime < currentDateTime) {
            setError("La fecha y hora deben ser futuras.");
            return;
        }

        // Validar que la capacidad sea un número válido
        if (!capacity || isNaN(capacity) || parseInt(capacity, 10) <= 0) {
            setError("La capacidad debe ser un número mayor que 0.");
            return;
        }

        // Validar URLs antes de enviar (Permite vacíos)
        if (!isValidURL(imageUrl)) {
            setError("La URL de la imagen principal no es válida.");
            return;
        }

        if (!isValidURL(songUrl)) {
            setError("La URL de la canción no es válida.");
            return;
        }

        for (const img of secondaryImages) {
            if (!isValidURL(img)) {
                setError(`La URL de la imagen secundaria "${img}" no es válida.`);
                return;
            }
        }

        try {
            const token = localStorage.getItem("token");
            const response = await API.post(
                "/events",
                {
                    userId,
                    name,
                    description,
                    date,
                    time,
                    location,
                    capacity: parseInt(capacity, 10),
                    type,
                    isActive,
                    imageUrl: imageUrl || null, // Evitar enviar strings vacíos
                    songUrl: songUrl || null,
                    secondaryImages: secondaryImages.filter(img => img.trim() !== ""),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            onCreateEvent(response.data);
            onClose();
        } catch (err) {
            console.error("Error al crear evento:", err.response?.data || err.message);
            setError("No se pudo crear el evento. Intenta nuevamente.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg h-screen max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Crear Nuevo Evento</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Sección Principal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Fecha y Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha</label>
                            <input
                                type="date"
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hora</label>
                            <input
                                type="time"
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Capacidad del Evento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Capacidad</label>
                        <input
                            type="number"
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            min="1"
                            required
                        />
                    </div>

                    {/* Imagen Principal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imagen Principal</label>
                        <input
                            type="text"
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </div>

                    {/* URL de Canción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL de la Canción</label>
                        <input
                            type="text"
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={songUrl}
                            onChange={(e) => setSongUrl(e.target.value)}
                        />
                    </div>

                    {/* Imágenes Secundarias */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imágenes Secundarias</label>
                        {secondaryImages.map((image, index) => (
                            <div key={index} className="flex items-center space-x-2 mt-2">
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    value={image}
                                    onChange={(e) => handleUpdateSecondaryImage(index, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-2 py-1 rounded-lg"
                                    onClick={() => handleRemoveSecondaryImage(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="mt-2 bg-gray-200 px-3 py-1 rounded-lg"
                            onClick={handleAddSecondaryImage}
                        >
                            + Agregar Imagen
                        </button>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-2">
                        <Button type="button" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Crear
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
