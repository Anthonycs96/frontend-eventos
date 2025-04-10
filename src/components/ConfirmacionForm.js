"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/input"
import Label from "@/components/ui/label"
import { X, Clock, Check, XCircle, AlertCircle, Heart, Music, Users, MessageSquare, Plus } from "lucide-react"
import API from "@/utils/api"
import InstruccionesForm from './InstruccionesForm';

// Modificar la función de validación para que solo acepte un nombre por campo
const validateName = (value) => {
    if (!value) return "El nombre es requerido";
    if (value.length < 3) return "El nombre debe tener al menos 3 caracteres";
    if (value.includes(',')) return "Por favor, usa un campo diferente para cada acompañante";
    return true;
};

const extractGuestId = (invitationUrl) => {
    if (!invitationUrl) return null
    const urlParts = invitationUrl.split("/")
    return urlParts[urlParts.length - 2]
}

export default function ConfirmacionForm({ invitationUrl, defaultValues, eventDetails, numberOfGuests }) {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [errorType, setErrorType] = useState("")
    const [willAttendStatus, setWillAttendStatus] = useState(null)
    const [daysRemaining, setDaysRemaining] = useState(15)
    const [deadlineDate, setDeadlineDate] = useState("")
    const [isDeadlinePassed, setIsDeadlinePassed] = useState(false)
    const [invitadoStatus, setInvitadoStatus] = useState(eventDetails?.invitado?.status || null)

    console.log("Estado del invitado:", invitadoStatus)

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
            willAttend: null,
        },
        mode: "onChange",
    })

    const {
        fields: companionFields,
        append: appendCompanion,
        remove: removeCompanion,
    } = useFieldArray({
        control,
        name: "additionalGuestNames",
    })

    const {
        fields: songFields,
        append: appendSong,
        remove: removeSong,
    } = useFieldArray({
        control,
        name: "suggestedSongs",
    })

    const guestId = extractGuestId(invitationUrl)
    const willAttend = watch("willAttend")

    const checkInvitadoStatus = useCallback(async () => {
        try {
            const response = await API.get(`/guest/${guestId}`)
            if (response.data && response.data.status) {
                const newStatus = response.data.status

                // Only update if the status has changed
                if (newStatus !== invitadoStatus) {
                    setInvitadoStatus(newStatus)

                    if (newStatus === "confirmed" || newStatus === "declined") {
                        setIsSubmitted(true)
                        setWillAttendStatus(newStatus)
                    }
                }
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error al verificar el estado del invitado"
            setErrorMessage(errorMsg)
            setErrorType("status")
            console.error("Error al verificar el estado del invitado:", error)
        }
    }, [guestId, invitadoStatus])

    useEffect(() => {
        checkInvitadoStatus()
    }, [checkInvitadoStatus])

    useEffect(() => {
        const interval = setInterval(checkInvitadoStatus, 10000)
        return () => clearInterval(interval)
    }, [checkInvitadoStatus])

    useEffect(() => {
        if (!eventDetails || !eventDetails.evento || !eventDetails.evento.date) {
            console.warn("No se encontró la fecha del evento.")
            return
        }

        const eventDate = new Date(eventDetails.evento.date)
        const deadline = new Date(eventDate)
        deadline.setDate(eventDate.getDate() - 15)

        const options = { year: "numeric", month: "long", day: "numeric" }
        setDeadlineDate(deadline.toLocaleDateString("es-ES", options))

        const updateDaysRemaining = () => {
            const now = new Date()
            const timeDiff = deadline.getTime() - now.getTime()
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
            setDaysRemaining(Math.max(0, daysDiff))
            setIsDeadlinePassed(now > deadline)
        }

        updateDaysRemaining()
        const interval = setInterval(updateDaysRemaining, 86400000) // Actualizar cada día
        return () => clearInterval(interval)
    }, [eventDetails])

    useEffect(() => {
        if (willAttend === false) {
            setValue("additionalGuestNames", [])
            setValue("suggestedSongs", [])
        }
    }, [willAttend, setValue])

    const handleFormSubmit = async (data) => {
        try {
            if (!data.willAttend) {
                setErrorMessage("Por favor, selecciona si asistirás o no al evento");
                setErrorType("validation");
                return;
            }

            if (!guestId) {
                setErrorMessage("No se pudo identificar tu invitación. Por favor, verifica el enlace.");
                setErrorType("validation");
                return;
            }

            setIsSubmitting(true);
            setErrorMessage("");
            setErrorType("");

            // Contar acompañantes válidos
            const processedGuests = data.additionalGuestNames.filter(name => name && name.trim());
            const totalAccompanying = processedGuests.length;

            // ⚠️ Validación extra si tienes un límite superior original
            if (totalAccompanying > numberOfGuests) {
                setErrorMessage(`Has excedido el número máximo de acompañantes permitidos (${numberOfGuests})`);
                setErrorType("validation");
                return;
            }

            // ✅ Actualizamos numberOfGuests con la cantidad real de acompañantes
            const payload = {
                ...data,
                numberOfGuests: totalAccompanying, // Aquí lo actualizas antes de enviar
                additionalGuestNames: processedGuests,
                suggestedSongs: data.suggestedSongs.map(song => song.song),
                personalMessage: data.personalMessage || "",
                status: data.willAttend === "true" ? "confirmed" : "declined",
            };

            const confirmResponse = await API.post(`/guest/confirm/${guestId}`, payload);

            if (confirmResponse.status === 200) {
                setIsSubmitted(true);
                setWillAttendStatus(data.willAttend === "true" ? "confirmed" : "declined");
                setErrorMessage("");
                setErrorType("");
                setInvitadoStatus(data.willAttend === "true" ? "confirmed" : "declined");
            }

        } catch (err) {
            setIsSubmitted(false);
            let mensaje = "Hubo un error al confirmar tu asistencia.";

            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        mensaje = "Los datos ingresados no son válidos.";
                        setErrorType("validation");
                        break;
                    case 404:
                        mensaje = "No se encontró tu invitación.";
                        setErrorType("notFound");
                        break;
                    case 409:
                        mensaje = "Ya has confirmado tu asistencia.";
                        setErrorType("duplicate");
                        break;
                    case 429:
                        mensaje = "Demasiados intentos. Espera unos minutos.";
                        setErrorType("rateLimit");
                        break;
                    default:
                        mensaje = "Problema en el servidor. Intenta más tarde.";
                        setErrorType("server");
                }
            }

            setErrorMessage(mensaje);
            console.error("Error al enviar el formulario:", err);
        } finally {
            setIsSubmitting(false);
        }
    };


    // Mensajes de estado
    if (invitadoStatus === "confirmed") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:bg-white shadow-none sm:shadow-2xl rounded-none sm:rounded-3xl p-6 w-full max-w mx-auto text-center"
            >
                <div className="flex flex-col items-center space-y-4">
                    <Check className="h-12 w-12 text-green-500" />
                    <h2 className="text-2xl font-semibold text-gray-800">¡Gracias por confirmar!</h2>
                    <p className="text-gray-600">Estamos emocionados de verte en el evento.</p>
                </div>

            </motion.div>
        )
    }

    if (invitadoStatus === "declined") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:bg-white shadow-none sm:shadow-2xl rounded-none sm:rounded-3xl p-6 w-full max-w mx-auto text-center"
            >
                <div className="flex flex-col items-center space-y-4">
                    <XCircle className="h-12 w-12 text-red-500" />
                    <h2 className="text-2xl font-semibold text-gray-800">Lamentamos que no puedas asistir</h2>
                    <p className="text-gray-600">Gracias por avisarnos. ¡Esperamos verte en otra ocasión!</p>
                </div>
            </motion.div>
        )
    }

    // Renderizar el formulario si el estado no es "confirmed" ni "declined"
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-2xl mx-auto"
        >
            {/* Encabezado mejorado */}
            <div className="text-center space-y-4">
                <motion.h2
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-serif text-amber-800"
                >
                    Tu Confirmación
                </motion.h2>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-amber-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-sm text-amber-600">
                            {eventDetails?.evento?.name}
                        </span>
                    </div>
                </div>
                <p className="text-gray-600">
                    Nos encantaría contar con tu presencia en este día tan especial
                </p>
            </div>

            {/* Agregar las instrucciones aquí */}
            <InstruccionesForm />
            {/* Mensajes de error/estado mejorados */}
            {(errorMessage || isDeadlinePassed) && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg shadow-sm ${errorType === "validation" ? "bg-amber-50 border border-amber-200" :
                        errorType === "server" ? "bg-red-50 border border-red-200" :
                            "bg-amber-50 border border-amber-200"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        {errorType === "server" ? (
                            <XCircle className="text-red-500 w-5 h-5" />
                        ) : (
                            <AlertCircle className="text-amber-500 w-5 h-5" />
                        )}
                        <p className={`text-sm ${errorType === "server" ? "text-red-700" : "text-amber-700"
                            }`}>
                            {errorMessage || `La fecha límite para confirmar era: ${deadlineDate}`}
                        </p>
                    </div>
                </motion.div>
            )}

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                {/* Sección de asistencia mejorada */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Heart className="w-5 h-5 text-amber-600" />
                        <Label className="text-lg text-amber-800 font-medium">
                            ¿Nos acompañarás en este día tan especial?
                        </Label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => {
                                setValue("willAttend", "true")
                                setErrorMessage("")
                            }}
                            className={`p-6 rounded-lg border-2 transition-all duration-300 
                                ${willAttend === "true"
                                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-lg"
                                    : "border-gray-200 hover:border-emerald-200"}`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Check className={`w-8 h-8 ${willAttend === "true" ? "text-emerald-500" : "text-gray-400"
                                    }`} />
                                <span className={`font-medium ${willAttend === "true" ? "text-emerald-700" : "text-gray-600"
                                    }`}>
                                    ¡Sí, asistiré!
                                </span>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => {
                                setValue("willAttend", "false")
                                setErrorMessage("")
                            }}
                            className={`p-6 rounded-lg border-2 transition-all duration-300 
                                ${willAttend === "false"
                                    ? "border-red-500 bg-gradient-to-br from-red-50 to-red-100/50 shadow-lg"
                                    : "border-gray-200 hover:border-red-200"}`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <X className={`w-8 h-8 ${willAttend === "false" ? "text-red-500" : "text-gray-400"
                                    }`} />
                                <span className={`font-medium ${willAttend === "false" ? "text-red-700" : "text-gray-600"
                                    }`}>
                                    No podré asistir
                                </span>
                            </div>
                        </motion.button>
                    </div>
                </div>

                {willAttend === "true" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Sección de acompañantes mejorada */}
                        {numberOfGuests > 0 && (
                            <div className="space-y-4 bg-gradient-to-br from-amber-50 to-amber-100/30 p-6 rounded-lg border border-amber-200/50 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-amber-600" />
                                        <Label className="text-lg text-amber-800 font-medium">
                                            ¿Vendrás con acompañantes?
                                        </Label>
                                    </div>
                                    <div className="bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                                        <span className="text-sm text-amber-700">
                                            {companionFields.length}/{numberOfGuests} acompañante{numberOfGuests > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {companionFields.map((field, index) => (
                                        <div key={field.id} className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 relative">
                                                    <Input
                                                        {...register(`additionalGuestNames.${index}`, {
                                                            validate: validateName
                                                        })}
                                                        placeholder="Nombre del acompañante"
                                                        className="bg-white/90"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 text-sm">
                                                        {index + 1}/{numberOfGuests}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCompanion(index)}
                                                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 hover:shadow-md"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {errors.additionalGuestNames?.[index] && (
                                                <p className="text-xs text-red-500 ml-1">
                                                    {errors.additionalGuestNames[index].message}
                                                </p>
                                            )}
                                        </div>
                                    ))}

                                    {companionFields.length < numberOfGuests && (
                                        <motion.button
                                            type="button"
                                            onClick={() => appendCompanion("")}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className="w-full p-4 border-2 border-dashed border-amber-200 rounded-lg
                                              text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100/30
                                              transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span>Agregar acompañante</span>
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Sección de canciones mejorada */}
                        <div className="space-y-4 bg-gradient-to-br from-amber-50 to-amber-100/30 p-6 rounded-lg border border-amber-200/50 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Music className="w-5 h-5 text-amber-600" />
                                <Label className="text-lg text-amber-800 font-medium">
                                    ¿Qué canciones te gustaría escuchar?
                                </Label>
                            </div>
                            <p className="text-sm text-amber-700">
                                Ayúdanos a crear la mejor playlist para la fiesta
                            </p>

                            <div className="space-y-4">
                                {songFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <Input
                                                {...register(`suggestedSongs.${index}.song`)}
                                                placeholder="Ej: Perfect - Ed Sheeran"
                                                className="bg-white/90 pr-12"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSong(index)}
                                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 hover:shadow-md"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}

                                <motion.button
                                    type="button"
                                    onClick={() => appendSong({ song: "" })}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full p-4 border-2 border-dashed border-amber-200 rounded-lg
                                      text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100/30
                                      transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Music className="w-5 h-5" />
                                    <span>Agregar canción a la playlist</span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Mensaje personal mejorado */}
                        <div className="space-y-4 bg-gradient-to-br from-amber-50 to-amber-100/30 p-6 rounded-lg border border-amber-200/50 shadow-sm">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-amber-600" />
                                <Label className="text-lg text-amber-800 font-medium">
                                    ¿Quieres dejarnos un mensaje?
                                </Label>
                            </div>
                            <div className="space-y-4">
                                <textarea
                                    {...register("personalMessage")}
                                    placeholder="Escribe un mensaje especial para los novios..."
                                    className="w-full p-4 rounded-lg
                                      border-2 border-amber-200/50
                                      bg-white/80 backdrop-blur-sm
                                      text-gray-700 placeholder-amber-400/70
                                      min-h-[120px] resize-y
                                      transition-all duration-300
                                      focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400
                                      hover:border-amber-300"
                                    rows={4}
                                />
                                <p className="text-xs text-amber-600/80 italic text-right">
                                    Tu mensaje será guardado con mucho cariño
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Botón de envío mejorado */}
                <motion.div
                    className="pt-6"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <Button
                        type="submit"
                        disabled={isSubmitting || isDeadlinePassed || !willAttend}
                        className={`w-full p-4 rounded-lg shadow-md transition-all duration-300
                            ${getButtonStyles(isSubmitting, isDeadlinePassed, willAttend)}`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-gray-600 font-medium">Enviando...</span>
                            </div>
                        ) : isDeadlinePassed ? (
                            <div className="flex items-center justify-center gap-2">
                                <Clock className="w-6 h-6 text-gray-400" />
                                <span className="text-gray-600 font-medium">Fecha límite expirada</span>
                            </div>
                        ) : willAttend === "true" ? (
                            <div className="flex items-center justify-center gap-2">
                                <Check className="w-6 h-6 text-emerald-500" />
                                <span className="text-emerald-700 font-medium">Confirmar asistencia</span>
                            </div>
                        ) : willAttend === "false" ? (
                            <div className="flex items-center justify-center gap-2">
                                <X className="w-6 h-6 text-red-500" />
                                <span className="text-red-700 font-medium">Confirmar inasistencia</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <AlertCircle className="w-6 h-6 text-amber-500" />
                                <span className="text-amber-700 font-medium">Selecciona una opción</span>
                            </div>
                        )}
                    </Button>
                </motion.div>
            </form>

            {/* Contador mejorado */}
            {!isDeadlinePassed && !isSubmitted && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 bg-amber-50/50 p-3 rounded-lg border border-amber-200/50"
                >
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm text-amber-700">
                        Te quedan <span className="font-bold">{daysRemaining} días</span> para confirmar
                    </span>
                </motion.div>
            )}
        </motion.div>
    )
}

// Función helper para los estilos del botón
function getButtonStyles(isSubmitting, isDeadlinePassed, willAttend) {
    if (isSubmitting) return 'border-gray-400 bg-gray-50';
    if (isDeadlinePassed) return 'border-gray-400 bg-gray-50';
    if (willAttend === "true") return 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700';
    if (willAttend === "false") return 'border-red-500 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700';
    return 'border-amber-200 bg-amber-50';
}
