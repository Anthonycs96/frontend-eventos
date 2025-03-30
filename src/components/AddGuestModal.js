"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import API from "@/utils/api";
import socket from "@/utils/socket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AddGuestModal({ onClose, onAddGuest, eventId }) {
  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+51", // Código de país de Perú
    type: "",
    invitadoDe: "",
    numberOfGuests: "",
  });

  const [countries, setCountries] = useState([]);
  const [includeEmail, setIncludeEmail] = useState(false);

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

    setGuestData((prevData) => ({
      ...prevData,
      [name]: name === "numberOfGuests" && value !== "" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos antes de envío:", guestData); // Verificar qué hay en guestData antes de enviarlo

    if (!guestData.name || !guestData.phone || !guestData.type) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const fullPhone = guestData.countryCode + guestData.phone;

    try {
      const guestDataToSubmit = {
        ...guestData,
        phone: fullPhone,
        status: "pending",
        eventId,
        numberOfGuests:
          guestData.numberOfGuests !== "" ? Number(guestData.numberOfGuests) : null, // Evita que Sequelize ponga 1 por defecto
        type: guestData.type !== "" ? guestData.type : null, // Evita que Sequelize ponga "amigo" por defecto
      };

      if (!includeEmail) {
        delete guestDataToSubmit.email;
      }

      console.log("Enviando datos:", guestDataToSubmit); // Agregar esto para depuración

      const response = await API.post("/guest", guestDataToSubmit);

      socket.emit("new_Guest", response.data);

      onAddGuest(response.data);
      onClose();
    } catch (error) {
      console.error("Error al crear el invitado:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Agregar Invitado
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={guestData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="includeEmail"
              checked={includeEmail}
              onChange={(e) => setIncludeEmail(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="includeEmail" className="text-gray-700 text-sm font-bold">
              Incluir correo electrónico
            </label>
          </div>

          {includeEmail && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={guestData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Teléfono *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                name="countryCode"
                value={guestData.countryCode}
                onChange={handleChange}
                className="col-span-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                value={guestData.phone}
                onChange={handleChange}
                className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de Invitado *
            </label>
            <select
              id="type"
              name="type"
              value={guestData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="principal">Principal</option>
              <option value="familiar">Familiar</option>
              <option value="amigo">Amigo</option>
              <option value="proveedor">Proveedor</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="invitadoDe"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Invitado de: *
            </label>
            <select
              id="invitadoDe"
              name="invitadoDe"
              value={guestData.invitadoDe}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="novio">Novio</option>
              <option value="novia">Novia</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="numberOfGuests"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Número de Acompañantes
            </label>
            <input
              type="number"
              id="numberOfGuests"
              name="numberOfGuests"
              value={guestData.numberOfGuests}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              onClick={onClose} >
              Cancelar
            </Button>
            <Button
              type="submit">
              Agregar Invitado
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
