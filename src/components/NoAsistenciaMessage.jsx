export default function NoAsistenciaMessage({ onClose }) {
  return (
    <div className="text-center space-y-6 py-4">
      <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-amber-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          Lamentamos que no puedas asistir
        </h3>
        <p className="text-gray-600">
          Gracias por avisarnos. ¡Esperamos verte en otra ocasión!
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2 px-4 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors duration-200"
      >
        Cerrar
      </button>
    </div>
  );
}
