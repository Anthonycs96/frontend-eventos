"use strict";

import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

import Label from "@/components/ui/label";
import { UserPlus, X } from "lucide-react";
import API from "@/utils/api";

const extractGuestId = (invitationUrl) => {
    if (!invitationUrl) return null;
    const urlParts = invitationUrl.split("/");
    return urlParts[urlParts.length - 2];
};

export default function ConfirmacionForm({ invitationUrl, defaultValues, eventDetails, numberOfGuests }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [willAttendStatus, setWillAttendStatus] = useState(null);

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
        },
        mode: "onChange",
    });

    const { fields: companionFields, append: appendCompanion, remove: removeCompanion } = useFieldArray({
        control,
        name: "additionalGuestNames",
    });

    const { fields: songFields, append: appendSong, remove: removeSong } = useFieldArray({
        control,
        name: "suggestedSongs",
    });

    const guestId = extractGuestId(invitationUrl);
    const willAttend = watch("willAttend", "false");

    useEffect(() => {
        if (eventDetails?.invitado?.status === "confirmed" || eventDetails?.invitado?.status === "declined") {
            setIsSubmitted(true);
            setWillAttendStatus(eventDetails.invitado.status);
        }
        // Si cambian a "No" asistencia, limpiamos los acompañantes y las canciones favoritas
        if (willAttend === "false") {
            setValue("additionalGuestNames", []);
            setValue("suggestedSongs", []);
        }
    }, [eventDetails, willAttend, setValue]);

    const handleFormSubmit = async (data) => {
        console.log("Datos crudos del formulario:", data);

        if (!guestId) {
            setErrorMessage("El ID de invitado es inválido.");
            return;
        }

        // Preparar los datos para enviar
        const payload = {
            ...data,
            additionalGuestNames: data.willAttend === "true" ? data.additionalGuestNames : [],
            suggestedSongs: data.willAttend === "true" ? data.suggestedSongs.map((song) => song.song) : [],
            personalMessage: data.personalMessage || "",
            status: data.willAttend === "true" ? "confirmed" : "declined",
        };

        try {
            const response = await API.post(`/guest/confirm/${guestId}`, payload);

            if (response.status === 200) {
                setIsSubmitted(true);
                setWillAttendStatus(payload.status);
                setErrorMessage("");
            }
        } catch (err) {
            setIsSubmitted(false);
            setErrorMessage("Hubo un error al confirmar tu asistencia.");
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md mx-auto text-center transform transition-all duration-300 hover:scale-105">
                {willAttendStatus === "confirmed" ? (
                    <>
                        <h2 className="text-4xl font-bold text-green-600 mb-6 animate-pulse">
                            ¡Gracias por Confirmar!
                        </h2>
                        <p className="text-gray-700 text-xl mb-8">
                            Estamos felices de contar con tu respuesta para nuestro día especial. 🎉
                        </p>
                        <div className="flex justify-center">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png" // Icono de celebración
                                alt="Celebración"
                                className="w-16 h-16"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-4xl font-bold text-red-600 mb-6">
                            Lamentamos que no puedas asistir
                        </h2>
                        <p className="text-gray-700 text-xl mb-8">
                            Agradecemos tu respuesta. ¡Esperamos verte en otra ocasión!
                        </p>
                        <div className="flex justify-center">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/979/979585.png" // Icono de despedida
                                alt="Despedida"
                                className="w-16 h-16"
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Confirma tu Asistencia</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label>¿Nos confirmas tu asistencia?</Label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="willAttend-yes"
                            value="true"
                            {...register("willAttend", { required: true })}
                            className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                        />
                        <Label htmlFor="willAttend-yes">Sí, asistiré</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="willAttend-no"
                            value="false"
                            {...register("willAttend", { required: true })}
                            className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                        />
                        <Label htmlFor="willAttend-no">No podré asistir</Label>
                    </div>
                    {errors.willAttend && <span className="text-red-500 text-sm">Este campo es requerido</span>}
                </div>

                {/* Acompañantes (solo si elige "Sí, asistiré") */}
                {/* Acompañantes (solo si elige "Sí, asistiré" y tiene pase para acompañantes) */}
                {willAttend === "true" && numberOfGuests > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Pase para {numberOfGuests} Acompañantes
                        </label>
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
                <Button type="submit" className="w-full">
                    {willAttend === "true" ? "Confirmar Asistencia" : "Enviar Respuesta"}
                </Button>
            </form>
        </div>
    );
}