"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/label";
import { X, Clock } from "lucide-react";
import API from "@/utils/api";

const extractGuestId = (invitationUrl) => {
    if (!invitationUrl) return null;
    const urlParts = invitationUrl.split("/");
    return urlParts[urlParts.length - 2];
};

export default function ConfirmacionForm({ invitationUrl, defaultValues, eventDetails, numberOfGuests }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para deshabilitar el botón
    const [errorMessage, setErrorMessage] = useState("");
    const [willAttendStatus, setWillAttendStatus] = useState(null);
    const [daysRemaining, setDaysRemaining] = useState(15);
    const [deadlineDate, setDeadlineDate] = useState("");
    const [invitadoStatus, setInvitadoStatus] = useState(eventDetails?.invitado?.status || null);

    console.log('Estado del invitado:', invitadoStatus);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            additionalGuestNames: defaultValues?.additionalGuestNames || [],
            suggestedSongs: defaultValues?.suggestedSongs || [],
            personalMessage: defaultValues?.personalMessage || "",
            willAttend: null, // Inicializar como null para evitar valores no deseados
        },
        mode: "onChange",
    });

    const {
        fields: companionFields,
        append: appendCompanion,
        remove: removeCompanion,
    } = useFieldArray({
        control,
        name: "additionalGuestNames",
    });

    const {
        fields: songFields,
        append: appendSong,
        remove: removeSong,
    } = useFieldArray({
        control,
        name: "suggestedSongs",
    });

    const guestId = extractGuestId(invitationUrl);
    const willAttend = watch("willAttend"); // Observar el valor de willAttend

    // Función para verificar el estado del invitado
    const checkInvitadoStatus = async () => {
        try {
            const response = await API.get(`/guest/${guestId}`);
            if (response.data && response.data.status) {
                setInvitadoStatus(response.data.status); // Actualiza el estado del invitado
                if (response.data.status === "confirmed" || response.data.status === "declined") {
                    setIsSubmitted(true);
                    setWillAttendStatus(response.data.status);
                }
            }
        } catch (error) {
            console.error("Error al verificar el estado del invitado:", error);
        }
    };

    // Verificar el estado del invitado cuando el componente se monta
    useEffect(() => {
        checkInvitadoStatus();
    }, [guestId]);

    // Verificar el estado del invitado cada 10 segundos
    useEffect(() => {
        const interval = setInterval(checkInvitadoStatus, 10000); // 10 segundos
        return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    }, [guestId]);

    // Calcular la fecha límite (15 días antes del evento)
    useEffect(() => {
        if (!eventDetails || !eventDetails.evento || !eventDetails.evento.date) {
            console.warn("No se encontró la fecha del evento.");
            return;
        }

        const eventDate = new Date(eventDetails.evento.date);
        const deadline = new Date(eventDate);
        deadline.setDate(eventDate.getDate() - 15);

        // Formatear la fecha límite
        const options = { year: "numeric", month: "long", day: "numeric" };
        setDeadlineDate(deadline.toLocaleDateString("es-ES", options));

        // Actualizar días restantes
        const updateDaysRemaining = () => {
            const now = new Date();
            const timeDiff = deadline.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            setDaysRemaining(Math.max(0, daysDiff));
        };

        updateDaysRemaining();

        // Actualizar días restantes diariamente
        const interval = setInterval(updateDaysRemaining, 86400000); // 24 horas

        return () => clearInterval(interval);
    }, [eventDetails]);

    // Limpiar acompañantes y canciones si elige "No"
    useEffect(() => {
        if (willAttend === false) {
            setValue("additionalGuestNames", []);
            setValue("suggestedSongs", []);
        }
    }, [willAttend, setValue]);

    // Manejar el envío del formulario
    const handleFormSubmit = async (data) => {
        if (!guestId) {
            setErrorMessage("El ID de invitado es inválido.");
            return;
        }

        setIsSubmitting(true); // Deshabilitar el botón mientras se procesa

        // Convertir willAttend a booleano
        const isAttending = data.willAttend === "true"; // "true" o "false" se convierten a true o false

        // Preparar los datos para enviar
        const payload = {
            ...data,
            additionalGuestNames: isAttending ? data.additionalGuestNames : [],
            suggestedSongs: isAttending ? data.suggestedSongs.map((song) => song.song) : [],
            personalMessage: data.personalMessage || "",
            status: isAttending ? "confirmed" : "declined", // Usar el booleano para determinar el estado
        };

        try {
            console.log('Enviar la confirmación', payload);
            // Enviar la confirmación
            const confirmResponse = await API.post(`/guest/confirm/${guestId}`, payload);

            if (confirmResponse.status === 200) {
                // Obtener el estado actualizado del invitado
                const statusResponse = await API.get(`/guest/${guestId}`);
                const updatedStatus = statusResponse.data.status; // Capturar el estado actualizado

                // Actualizar el estado en la interfaz de usuario
                setIsSubmitted(true);
                setWillAttendStatus(updatedStatus);
                setErrorMessage("");
                setInvitadoStatus(updatedStatus); // Actualizar el estado del invitado

                console.log("Estado actualizado del invitado:", updatedStatus); // Imprimir el estado en la consola
            }
        } catch (err) {
            setIsSubmitted(false);
            setErrorMessage("Hubo un error al confirmar tu asistencia.");
            console.error("Error al enviar el formulario:", err);
        } finally {
            setIsSubmitting(false); // Habilitar el botón después de procesar
        }
    };

    // Mostrar el formulario si no se ha enviado
    return (
        <div className="sm:bg-white shadow-none sm:shadow-2xl rounded-none sm:rounded-3xl p-6 w-full max-w mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Confirma tu Asistencia</h2>

            {/* Banner de plazo de confirmación */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-amber-700 mb-2">
                    <Clock className="h-5 w-5" />
                    <h3 className="font-medium">Plazo de Confirmación</h3>
                </div>
                <p className="text-sm text-amber-700">
                    Por favor confirma tu asistencia antes del <span className="font-semibold">{deadlineDate}</span>
                </p>
                <div className="mt-2 flex items-center gap-2">
                    <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                        {daysRemaining} {daysRemaining === 1 ? "día" : "días"} restantes
                    </div>
                </div>
            </div>

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{errorMessage}</div>
            )}

            {isSubmitted ? (
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {invitadoStatus === "confirmed"
                            ? "¡Gracias por confirmar tu asistencia!"
                            : "Lamentamos que no puedas asistir."}
                    </h3>
                    <p className="text-gray-600 mt-2">
                        {invitadoStatus === "confirmed"
                            ? "Esperamos verte en el evento."
                            : "Gracias por avisarnos."}
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label>¿Nos confirmas tu asistencia?</Label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id="willAttend-yes"
                                value="true" // Usar "true" como valor
                                {...register("willAttend", { required: true })}
                                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <Label htmlFor="willAttend-yes">Sí, asistiré</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id="willAttend-no"
                                value="false" // Usar "false" como valor
                                {...register("willAttend", { required: true })}
                                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <Label htmlFor="willAttend-no">No podré asistir</Label>
                        </div>
                        {errors.willAttend && <span className="text-red-500 text-sm">Este campo es requerido</span>}
                    </div>

                    {/* Acompañantes (solo si elige "Sí, asistiré" y tiene pase para acompañantes) */}
                    {willAttend === "true" && numberOfGuests > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Pase para {numberOfGuests} Acompañantes</label>
                            {companionFields.map((field, index) => (
                                <div key={field.id} className="flex items-center space-x-2 mb-2">
                                    <Input
                                        {...register(`additionalGuestNames.${index}`)}
                                        defaultValue={field.name || ""}
                                        className="form-input flex-grow mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
                                        placeholder="Nombre del acompañante"
                                    />
                                    <Button type="button" onClick={() => removeCompanion(index)} variant="outline" size="icon">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {companionFields.length < numberOfGuests && (
                                <button
                                    type="button"
                                    onClick={() => appendCompanion("")}
                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                >
                                    + Añadir acompañante
                                </button>
                            )}
                        </div>
                    )}

                    {/* Canciones Favoritas (solo si elige "Sí, asistiré") */}
                    {willAttend === "true" && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Canciones Favoritas</label>
                            {songFields.map((field, index) => (
                                <div key={field.id} className="flex items-center space-x-2 mb-2">
                                    <Input
                                        {...register(`suggestedSongs.${index}.song`)}
                                        className="form-input flex-grow mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
                                        placeholder="Nombre de la canción"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSong(index)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => appendSong({ song: "" })}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                                + Añadir otra canción
                            </button>
                        </div>
                    )}

                    {/* Mensaje para los novios (siempre visible) */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Mensaje para los Novios</label>
                        <textarea
                            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
                            rows="3"
                            {...register("personalMessage")}
                            placeholder="Deja un mensaje especial para nosotros"
                        ></textarea>
                    </div>

                    {/* Botón dinámico */}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Enviando..." : (willAttend === "true" ? "Confirmar Asistencia" : "Enviar Respuesta")}
                    </Button>
                </form>
            )}
        </div>
    );
}