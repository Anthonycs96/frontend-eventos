"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { useEffect, useState, useCallback } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Label from "@/components/ui/label"
import { X, Clock, Check, XCircle, AlertCircle } from "lucide-react" // Importa íconos para los mensajes
import API from "@/utils/api"

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
        if (!guestId) {
            setErrorMessage("No se pudo identificar tu invitación. Por favor, verifica el enlace.")
            setErrorType("validation")
            return
        }

        setIsSubmitting(true)
        setErrorMessage("")
        setErrorType("")

        const isAttending = data.willAttend === "true"

        const payload = {
            ...data,
            additionalGuestNames: isAttending ? data.additionalGuestNames : [],
            suggestedSongs: isAttending ? data.suggestedSongs.map((song) => song.song) : [],
            personalMessage: data.personalMessage || "",
            status: isAttending ? "confirmed" : "declined",
        }

        try {
            const confirmResponse = await API.post(`/guest/confirm/${guestId}`, payload)

            if (confirmResponse.status === 200) {
                // Update the status immediately without waiting for the next poll
                setIsSubmitted(true)
                setWillAttendStatus(isAttending ? "confirmed" : "declined")
                setErrorMessage("")
                setErrorType("")
                setInvitadoStatus(isAttending ? "confirmed" : "declined")
            }
        } catch (err) {
            setIsSubmitted(false)
            let mensaje = "Hubo un error al confirmar tu asistencia."

            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        mensaje = "Los datos ingresados no son válidos. Por favor revisa la información."
                        setErrorType("validation")
                        break
                    case 404:
                        mensaje = "No se encontró tu invitación. Por favor, verifica el enlace."
                        setErrorType("notFound")
                        break
                    case 409:
                        mensaje = "Ya has confirmado tu asistencia anteriormente."
                        setErrorType("duplicate")
                        break
                    case 429:
                        mensaje = "Has realizado demasiados intentos. Por favor, espera unos minutos."
                        setErrorType("rateLimit")
                        break
                    default:
                        mensaje = "Hubo un problema con el servidor. Por favor, intenta más tarde."
                        setErrorType("server")
                }
            }

            setErrorMessage(mensaje)
            console.error("Error al enviar el formulario:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Mensajes de estado
    if (invitadoStatus === "confirmed") {
        return (
            <div className="sm:bg-white shadow-none sm:shadow-2xl rounded-none sm:rounded-3xl p-6 w-full max-w mx-auto text-center">
                <div className="flex flex-col items-center space-y-4">
                    <Check className="h-12 w-12 text-green-500" />
                    <h2 className="text-2xl font-semibold text-gray-800">¡Gracias por confirmar!</h2>
                    <p className="text-gray-600">Estamos emocionados de verte en el evento.</p>
                </div>
            </div>
        )
    }

    if (invitadoStatus === "declined") {
        return (
            <div className="sm:bg-white shadow-none sm:shadow-2xl rounded-none sm:rounded-3xl p-6 w-full max-w mx-auto text-center">
                <div className="flex flex-col items-center space-y-4">
                    <XCircle className="h-12 w-12 text-red-500" />
                    <h2 className="text-2xl font-semibold text-gray-800">Lamentamos que no puedas asistir</h2>
                    <p className="text-gray-600">Gracias por avisarnos. ¡Esperamos verte en otra ocasión!</p>
                </div>
            </div>
        )
    }

    // Renderizar el formulario si el estado no es "confirmed" ni "declined"
    return (
        <div className="space-y-6">
            {/* Encabezado del formulario */}
            <div className="text-center space-y-3 mb-8">
                <h2 className="text-2xl font-serif text-amber-800">Confirmación de Asistencia</h2>
                <p className="text-gray-600">
                    Nos encantaría contar con tu presencia en este día tan especial
                </p>
            </div>

            {/* Mensaje de estado o error */}
            {(errorMessage || isDeadlinePassed) && (
                <div className={`p-4 rounded-lg ${errorType === "validation" ? "bg-amber-50 border border-amber-200" :
                    errorType === "server" ? "bg-red-50 border border-red-200" :
                        "bg-amber-50 border border-amber-200"
                    }`}>
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
                </div>
            )}

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                {/* Sección de Asistencia */}
                <div className="space-y-4">
                    <Label className="text-lg text-amber-800 font-medium block mb-4">
                        ¿Nos acompañarás en este día tan especial?
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setValue("willAttend", "true")}
                            className={`p-4 rounded-lg border-2 transition-all duration-300 ${willAttend === "true"
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-gray-200 hover:border-emerald-200"
                                }`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Check className={`w-8 h-8 ${willAttend === "true" ? "text-emerald-500" : "text-gray-400"
                                    }`} />
                                <span className={`font-medium ${willAttend === "true" ? "text-emerald-700" : "text-gray-600"
                                    }`}>
                                    ¡Sí, asistiré!
                                </span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setValue("willAttend", "false")}
                            className={`p-4 rounded-lg border-2 transition-all duration-300 ${willAttend === "false"
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200 hover:border-red-200"
                                }`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <X className={`w-8 h-8 ${willAttend === "false" ? "text-red-500" : "text-gray-400"
                                    }`} />
                                <span className={`font-medium ${willAttend === "false" ? "text-red-700" : "text-gray-600"
                                    }`}>
                                    No podré asistir
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                {willAttend === "true" && (
                    <>
                        {/* Sección de Acompañantes */}
                        {numberOfGuests > 0 && (
                            <div className="space-y-4 bg-amber-50/50 p-6 rounded-lg border border-amber-100">
                                <Label className="text-lg text-amber-800 font-medium block">
                                    ¿Vendrás con acompañantes?
                                </Label>
                                <p className="text-sm text-amber-700">
                                    Puedes traer hasta {numberOfGuests} acompañante{numberOfGuests > 1 ? 's' : ''}
                                </p>

                                <div className="space-y-4">
                                    {companionFields.map((field, index) => (
                                        <div key={field.id} className="flex items-center gap-2">
                                            <Input
                                                {...register(`additionalGuestNames.${index}`)}
                                                placeholder={`Nombre del acompañante ${index + 1}`}
                                                className="flex-1"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeCompanion(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}

                                    {companionFields.length < numberOfGuests && (
                                        <button
                                            type="button"
                                            onClick={() => appendCompanion("")}
                                            className="w-full p-3 border-2 border-dashed border-amber-200 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                                        >
                                            + Agregar acompañante
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Sección de Canciones */}
                        <div className="space-y-4 bg-amber-50/50 p-6 rounded-lg border border-amber-100">
                            <Label className="text-lg text-amber-800 font-medium block">
                                ¿Qué canciones te gustaría escuchar?
                            </Label>
                            <p className="text-sm text-amber-700">
                                Ayúdanos a crear la mejor playlist para la fiesta
                            </p>

                            <div className="space-y-4">
                                {songFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <Input
                                            {...register(`suggestedSongs.${index}.song`)}
                                            placeholder="Nombre de la canción - Artista"
                                            className="flex-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSong(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => appendSong({ song: "" })}
                                    className="w-full p-3 border-2 border-dashed border-amber-200 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                                >
                                    + Agregar canción
                                </button>
                            </div>
                        </div>

                        {/* Mensaje Personal */}
                        <div className="space-y-4">
                            <Label className="text-lg text-amber-800 font-medium block">
                                ¿Quieres dejarnos un mensaje?
                            </Label>
                            <textarea
                                {...register("personalMessage")}
                                placeholder="Escribe un mensaje especial para los novios..."
                                className="w-full p-4 rounded-lg border border-amber-200 bg-white/50 focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all"
                                rows={4}
                            />
                        </div>
                    </>
                )}

                {/* Botón de envío */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting || isDeadlinePassed || !willAttend}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-300
                            ${isSubmitting ? 'border-gray-400 bg-gray-50' :
                                isDeadlinePassed ? 'border-gray-400 bg-gray-50' :
                                    willAttend === "true" ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100' :
                                        willAttend === "false" ? 'border-red-500 bg-red-50 hover:bg-red-100' :
                                            'border-amber-200 bg-amber-50 hover:bg-amber-100'}`}
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
                </div>
            </form>

            {/* Contador de días restantes */}
            {!isDeadlinePassed && !isSubmitted && (
                <div className="flex items-center justify-center gap-2 text-amber-700 mt-4">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                        Te quedan {daysRemaining} días para confirmar tu asistencia
                    </span>
                </div>
            )}
        </div>
    )
}
