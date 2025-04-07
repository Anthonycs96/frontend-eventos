import { HelpCircle, Check, Users, Music, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function InstruccionesForm() {
  const steps = [
    {
      icon: <Check className="w-5 h-5" />,
      title: "Confirma tu asistencia",
      description: "Selecciona si podrás acompañarnos en nuestro día especial",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Indica tus acompañantes",
      description: "Si tienes invitados adicionales, agrégalos con sus nombres",
    },
    {
      icon: <Music className="w-5 h-5" />,
      title: "Sugiere canciones",
      description: "¡Ayúdanos a crear la playlist perfecta para la fiesta!",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Déjanos un mensaje",
      description: "Opcional: Comparte tus buenos deseos con nosotros",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-50 to-amber-100/50 p-6 rounded-lg mb-8"
    >
      <div className="flex items-start gap-3 mb-4">
        <HelpCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-medium text-amber-800 text-lg mb-2">
            ¿Cómo confirmar tu asistencia?
          </h3>
          <p className="text-amber-700/80 text-sm mb-4">
            Sigue estos pasos para completar tu confirmación:
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 bg-white/80 p-3 rounded-lg border border-amber-200/30"
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <div className="text-amber-600">{step.icon}</div>
            </div>
            <div>
              <h4 className="font-medium text-amber-900">{step.title}</h4>
              <p className="text-sm text-amber-700/70">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-amber-200/30">
        <p className="text-xs text-amber-600/80 text-center italic">
          💡 Tip: Asegúrate de tener a la mano los nombres de tus acompañantes
          si planeas traerlos
        </p>
      </div>
    </motion.div>
  );
}
