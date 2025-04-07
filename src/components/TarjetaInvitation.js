"use client";

import Image from "next/image";
import { Calendar, MapPin, Gift, Clock, Volume2, VolumeX, Heart, XCircle } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import HeaderInvitacion from "@/components/HeaderInvitacion";
import ContadorRegresivo from "@/components/ContadorRegresivo";
import ConfirmacionForm from "@/components/ConfirmacionForm";
import ListaRegalos from "@/components/ListaRegalos";
import { ImprovedCarousel } from "@/components/ui/SimpleCarousel";
import Modal from "@/components/ui/Modal";

export default function TarjetaInvitation({
  evento,
  numberOfGuests,
  invitado,
  fontClass,
}) {
  const [modals, setModals] = useState({
    confirmacion: false,
    regalos: false,
  });

  if (!evento) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-md mx-auto p-6 text-center">
        <p className="text-gray-600">Cargando datos del evento...</p>
      </div>
    );
  }

  const imageUrl = evento.imageUrl?.startsWith("http")
    ? evento.imageUrl
    : "https://via.placeholder.com/600x300?text=Evento";

  const fechaObj = new Date(evento.date);
  const dia = fechaObj.toLocaleDateString("es-ES", { day: "2-digit" });
  const mes = fechaObj.toLocaleDateString("es-ES", { month: "short" }).toUpperCase();
  const anio = fechaObj.getFullYear();

  const abrirGoogleMaps = () => {
    const direccionCompleta = "Av. Dorado N.º 102, Lurigancho-Chosica, Lima, Peru";
    const url = `https://www.google.com/maps?q=${encodeURIComponent(direccionCompleta)}`;
    window.open(url, "_blank");
  };

  const formatTime = (time) => {
    if (!time) return '';

    // Convertir la hora a formato de 12 horas con AM/PM
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    return {
      hour: hour12,
      minutes,
      period: ampm
    };
  };


  return (
    <>
      <div className="max-w w-full bg-white rounded-lg overflow-hidden shadow-lg border border-gold/20">
        {/* Contenido principal */}
        <div className="relative overflow-hidden max-w-lg mx-auto">
          <div
            className="relative overflow-hidden max-w-lg mx-auto transform transition duration-500 from-black/0 via-black/20 to-black/0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${imageUrl || "/placeholder.svg"})`,
            }}
          >
            {/* Overlay para mejor contraste */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-black/10 pointer-events-none md:hidden"></div>

            {/* Frase principal */}
            <div className="text-center p-6 space-y-4 ">
              <div className="relative">
                <p
                  className={`text-5xl sm:text-7xl lg:text-5xl font-bold text-gold drop-shadow-[2px_2px_4px_rgba(139, 101, 23, 0.7)] mb-2 ${fontClass}`}
                >
                  {evento.description}
                </p>
              </div>

              {/* Ilustración floral */}
              <div className="flex justify-center py-2">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25 10C25 10 30 20 40 25C30 30 25 40 25 40C25 40 20 30 10 25C20 20 25 10 25 10Z"
                    stroke="#D4AF37"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              {/* Cita bíblica */}
              <div className="space-y-2 px-6">
                <p className="text-oliveAccent text-sm italic">
                  El amor nos une y la familia nos fortalece. Nada nos haría más
                  felices que compartir nuestra alegría con quienes más queremos.
                </p>
                <p className="text-gold text-sm">Romanos 12:10</p>
              </div>
            </div>

            {/* Nombres de los novios */}
            <div className="text-center py-4 bg-champagne/30 items-center flex flex-col ">
              <div className="w-16 h-1 bg-amber-300 mb-4 rounded-full"></div>
              <h1
                className={`${fontClass} text-gold text-5xl drop-shadow-[2px_2px_4px_rgba(139, 101, 23, 0.7)] mb-5 `}
              >
                {evento.name}
              </h1>
              <div className="w-16 h-1 bg-amber-300 mb-4 rounded-full"></div>
            </div>

            {/* Detalles de la ceremonia */}
            <div className="text-center p-6 space-y-2 ">
              {/* Header section */}
              <div className="block sm:hidden">
                <HeaderInvitacion invitado={invitado} />
              </div>
              {/* Fecha y hora */}
              <div className="flex justify-center items-center gap-8 my-8">
                <div className="text-center p-4 bg-champagne/30 rounded-lg border border-gold/20">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-gold" />
                  <p className="text-5xl font-bold text-oliveAccent">{dia}</p>
                  <p className="text-xl font-medium text-gold">{mes}</p>
                  <p className="text-xl text-oliveAccent">{anio}</p>
                </div>
                <div className="text-center p-4 bg-champagne/30 rounded-lg border border-gold/20">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gold" />
                  <p className="text-lg font-medium text-gold">Hora</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-4xl font-bold text-oliveAccent">
                        {formatTime(evento.time).hour}
                      </span>
                      <span className="text-4xl font-bold text-oliveAccent">:</span>
                      <span className="text-4xl font-bold text-oliveAccent">
                        {formatTime(evento.time).minutes}
                      </span>
                    </div>
                    <span className="text-lg font-medium text-gold/90 inline-block">
                      {formatTime(evento.time).period}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de ubicación mejorada */}
            <div className="py-6 px-4">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg border border-amber-200/30 space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-medium text-amber-800">Ubicación del Evento</h3>
                </div>

                <div className="space-y-2 text-center">
                  <p className="text-gray-800 font-medium">{evento.location}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Av. Dorado N.º 102, distrito de Lurigancho-Chosica</p>
                    <p className="italic">(Referencia: entre La Cantuta y El Remanso)</p>
                  </div>
                </div>

                <button
                  onClick={abrirGoogleMaps}
                  className="w-full mt-4 flex items-center justify-center gap-2 p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200/30 transition-all duration-300"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Ver en Google Maps</span>
                </button>
              </div>
            </div>

            {/* Guest information */}
            <div className="{`bg-white/90 backdrop-blur-sm`}">
              <p className="text-2xl font-medium leading-relaxed text-gray-800 text-center">
                {numberOfGuests > 0
                  ? `¡Puedes asistir con ${numberOfGuests} acompañante${numberOfGuests > 1 ? "s" : ""
                  }!`
                  : "Te esperamos con mucha alegría, disfruta este gran día con nosotros 💖"}
              </p>
            </div>

            {/* Iconos informativos con mejor guía visual */}
            <div className="py-8 px-4">
              <h3 className="text-center text-lg font-medium text-amber-800 mb-6">
                ¿Qué deseas hacer?
              </h3>
              <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
                {/* Botón de Confirmación - Destacado */}
                <div className="w-full  block sm:hidden">
                  <button
                    onClick={() => setModals(prev => ({ ...prev, confirmacion: true }))}
                    className=" w-full flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
                  >
                    <Calendar className="w-6 h-6" />
                    <div className="text-left">
                      <p className="font-medium text-lg">Confirmar Asistencia</p>
                      <p className="text-sm opacity-90">
                        ¡Toca aquí para confirmar tu asistencia!
                      </p>
                    </div>
                  </button>
                </div>

                <div className="w-full grid grid-cols-2 gap-4">
                  {/* Botón de Ubicación */}
                  <button
                    onClick={abrirGoogleMaps}
                    className="flex flex-col items-center p-4 bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-lg border border-amber-200/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center mb-2">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <p className="text-amber-900 font-medium">Ver Ubicación</p>
                    <p className="text-amber-700/80 text-sm">¿Cómo llegar?</p>
                  </button>

                  {/* Botón de Regalos */}
                  <button
                    onClick={() => setModals(prev => ({ ...prev, regalos: true }))}
                    className="flex flex-col items-center p-4 bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-lg border border-amber-200/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center mb-2">
                      <Gift className="text-white" size={24} />
                    </div>
                    <p className="text-amber-900 font-medium">Lista de Regalos</p>
                    <p className="text-amber-700/80 text-sm">Ver sugerencias</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Mensaje final */}
            <div className="text-center p-7 bg-gradient-to-b from-white/70 to-amber-50/30 backdrop-blur-sm rounded-lg mt-2 shadow-sm max-w-md mx-auto overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"></div>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <span className="absolute -left-24 top-1/2 w-16 h-px bg-gradient-to-r from-transparent to-amber-200/70"></span>
                  <h3 className="text-amber-800 font-serif text-lg tracking-wide">
                    Código de Vestimenta
                  </h3>
                  <span className="absolute -right-24 top-1/2 w-16 h-px bg-gradient-to-l from-transparent to-amber-200/70"></span>
                </div>

                <p className="text-gray-700 font-medium tracking-wider">
                  Formal Elegante
                </p>

                <div className="w-full max-w-[300px] mx-auto space-y-6">
                  {/* Vestimenta con actitud */}
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <p className="text-amber-900 font-semibold">Damas 💃</p>
                      <ul className="text-gray-700 space-y-1">
                        <li>
                          <span className="text-amber-700">•</span>Vestido largo o corto, tú decides. Lo importante es que te sientas como una reina.
                        </li>
                        <li>
                          <span className="text-amber-700">•</span>Colores
                          vibrantes, nada de modo sigilo.
                        </li>
                        <li>
                          <span className="text-amber-700">•</span>Tacones que
                          dominen el mundo.
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <p className="text-amber-900 font-semibold">
                        Caballeros 🤵
                      </p>
                      <ul className="text-gray-700 space-y-1">
                        <li>
                          <span className="text-amber-700">•</span>Traje digno de
                          Tony Stark o 007.
                        </li>
                        <li>
                          <span className="text-amber-700">•</span>Corbata o moño,
                          porque el estilo manda.
                        </li>
                        <li>
                          <span className="text-amber-700">•</span>Zapatos listos
                          para la alfombra roja.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Aviso Stark */}
                  <div className="relative">
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent my-5"></div>
                    <div className="bg-amber-50/90 p-3 rounded-lg border border-amber-300/50 shadow-sm text-center">
                      <p className="text-amber-800 font-medium">
                        ✧ La única de blanco será la novia. No insistas. ✧
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"></div>
            </div>

            {/* Countdown timer (mobile only) */}
            <div className="md:hidden">
              <ContadorRegresivo fecha={evento?.date} />
            </div>

            {/* Imagen final */}
            <div className="block sm:hidden relative w-full h-full">
              <div className="absolute  bg-gold/10 z-10"></div>
              <ImprovedCarousel images={evento?.secondaryImages || []} />
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <Modal
        isOpen={modals.confirmacion}
        onClose={() => setModals(prev => ({ ...prev, confirmacion: false }))}
        title="¿Nos acompañarás?"
      >
        <ConfirmacionForm
          invitationUrl={invitado?.invitationUrl}
          numberOfGuests={numberOfGuests}
          defaultValues={{
            willAttend: invitado?.status === "confirmed" ? true : null,
            companions: [],
            favoriteSongs: [{ song: "" }],
            allergies: "",
            specialRequests: "",
            personalMessage: "",
            additionalGuestNames: [],
            suggestedSongs: [],
          }}
          eventDetails={{ invitado, evento }}
          isConfirmed={invitado?.status === "confirmed"}
          onClose={() => setModals(prev => ({ ...prev, confirmacion: false }))}
        />
      </Modal>

      <Modal
        isOpen={modals.regalos}
        onClose={() => setModals(prev => ({ ...prev, regalos: false }))}
        title="Lista de Regalos"
      >
        <ListaRegalos
          eventDetails={evento}
          fontClass={fontClass}
        />
      </Modal>
    </>
  );
}
