import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function EditGuestModal({ guest, onClose, onSave }) {
  const [editedGuest, setEditedGuest] = useState({
    name: "",
    email: "",
    phone: "",
    comments: "",
  });

  useEffect(() => {
    if (guest) {
      setEditedGuest({ ...guest });
    }
  }, [guest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedGuest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedGuest);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Editar Invitado
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-1"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedGuest.name || ""}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-bold mb-1"
            >
              Teléfono (incluir código de país, ej: 51978488900 para Perú)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={editedGuest.phone || ""}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Ej: 51978488900"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-1"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedGuest.email || ""}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="comments"
              className="block text-gray-700 text-sm font-bold mb-1"
            >
              Comentarios
            </label>
            <textarea
              id="comments"
              name="comments"
              value={editedGuest.comments || ""}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex justify-between">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Guardar cambios
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
