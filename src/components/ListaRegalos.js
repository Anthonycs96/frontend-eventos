import { Gift, DollarSign, Users } from "lucide-react";

export default function ListaRegalos({ eventDetails, fontClass }) {
  console.log("eventDetails:", eventDetails)
  return (
    <div className="max-w-lg mx-auto p-1 sm:p-6 bg-white  space-y-6">
      {/* Título */}
      <h2 className={` text-3xl font-bold text-gray-800 text-center`}>
        🎁 Lista de Regalos
      </h2>
      <p className={`${fontClass} text-center text-gray-600 italic text-4xl sm:text-7xl lg:text-8xl`}>
        {eventDetails?.name}
      </p>

      {/* Lluvia de Sobres */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <DollarSign className="text-amber-600 w-6 h-6" />
          <h3 className="text-xl font-semibold text-amber-700">
            Lluvia de sobres
          </h3>
        </div>
        <p className="text-gray-700">
          Si quieres darnos un regalo que realmente apreciemos, el efectivo es
          la mejor opción. Solo deja tu aporte en el sobre y disfruta de la
          fiesta. 🥂
        </p>
      </div>

      {/* Padrinos y Madrinas */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Users className="text-amber-600 w-6 h-6" />
          <h3 className="text-xl font-semibold text-amber-700">
            Padrinos y Madrinas
          </h3>
        </div>
        <p className="text-gray-700">
          Si tienes el <span className="font-bold">superpoder</span> de apoyar en
          nuestra boda, eres bienvenido. Escríbenos por WhatsApp o redes
          sociales y hagamos magia juntos. ✨
        </p>
      </div>

      {/* Regalos */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Gift className="text-amber-600 w-6 h-6" />
          <h3 className="text-xl font-semibold text-amber-700">Regalos</h3>
        </div>
        <p className="text-gray-700">
          Si prefieres un detalle físico, lo recibimos con gratitud (pero
          recuerda, <span className="font-bold">cash nunca falla</span>). 😎
        </p>
      </div>
    </div>
  );
}
