"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import API from "@/utils/api";
import socket from "@/utils/socket";

export default function EditGuestModal({ guest, onClose, onSave, eventId }) {
  const [editedGuest, setEditedGuest] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+51", // Código de país de Perú
    type: "",
    numberOfGuests: "",
    comments: "",
  });

  const [countries, setCountries] = useState([]);
  const [includeEmail, setIncludeEmail] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (guest) {
      // Separar el código de país y el número de teléfono
      const phone = guest.phone || "";
      const countryCode = phone.substring(0, 3); // Asume que el código de país tiene 3 dígitos
      const phoneNumber = phone.substring(3);

      setEditedGuest({
        ...guest,
        countryCode: countryCode || "+51",
        phone: phoneNumber,
      });
    }
  }, [guest]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryList = data
          .map((country) => ({
            name: country.name.common,
            code:
              country.idd.root +
              (country.idd.suffixes ? country.idd.suffixes[0] : ""),
          }))
          .filter((country) => country.code);

        // Ordenar los países para que Perú aparezca primero
        const sortedCountries = countryList.sort((a, b) => {
          if (a.code === "+51") return -1; // Perú primero
          if (b.code === "+51") return 1;
          return a.name.localeCompare(b.name);
        });

        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedGuest((prev) => ({
      ...prev,
      [name]: name === "numberOfGuests" && value !== "" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
    const newErrors = {};
    if (!editedGuest.name) newErrors.name = "El nombre es obligatorio";
    if (!editedGuest.phone) newErrors.phone = "El teléfono es obligatorio";
    if (!editedGuest.type)
      newErrors.type = "El tipo de invitado es obligatorio";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const fullPhone = editedGuest.countryCode + editedGuest.phone;

    try {
      const guestDataToSubmit = {
        ...editedGuest,
        phone: fullPhone,
        numberOfGuests:
          editedGuest.numberOfGuests !== ""
            ? Number(editedGuest.numberOfGuests)
            : null,
        type: editedGuest.type !== "" ? editedGuest.type : null,
      };

      if (!includeEmail) {
        delete guestDataToSubmit.email;
      }

      const response = await API.put(`/guest/${guest.id}`, guestDataToSubmit);

      socket.emit("update_Guest", response.data);

      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error al actualizar el invitado:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Editar Invitado</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-1"
            >
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedGuest.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">{errors.name}</p>
            )}
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="includeEmail"
              checked={includeEmail}
              onChange={(e) => setIncludeEmail(e.target.checked)}
              className="mr-2"
            />
            <label
              htmlFor="includeEmail"
              className="text-gray-700 text-sm font-bold"
            >
              Incluir correo electrónico
            </label>
          </div>

          {includeEmail && (
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
                value={editedGuest.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-bold mb-1"
            >
              Teléfono *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                name="countryCode"
                value={editedGuest.countryCode}
                onChange={handleChange}
                className="col-span-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countries.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={editedGuest.phone}
                onChange={handleChange}
                className="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs italic">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-gray-700 text-sm font-bold mb-1"
            >
              Tipo de Invitado *
            </label>
            <select
              id="type"
              name="type"
              value={editedGuest.type}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="principal">Principal</option>
              <option value="familiar">Familiar</option>
              <option value="amigo">Amigo</option>
              <option value="proveedor">Proveedor</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs italic">{errors.type}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="numberOfGuests"
              className="block text-gray-700 text-sm font-bold mb-1"
            >
              Número de Acompañantes
            </label>
            <input
              type="number"
              id="numberOfGuests"
              name="numberOfGuests"
              value={editedGuest.numberOfGuests}
              onChange={handleChange}
              min="0"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
