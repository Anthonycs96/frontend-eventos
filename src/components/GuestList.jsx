"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/Button";
import {
  Edit,
  Trash2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  User,
  Users,
  Home,
  Briefcase,
  Search,
} from "lucide-react";

export default function GuestList({
  guests,
  onEdit,
  onDelete,
  onSendCustomMessage,
}) {
  const [expandedGuest, setExpandedGuest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (guestId) => {
    setExpandedGuest(expandedGuest === guestId ? null : guestId);
  };

  const statusTranslations = {
    confirmed: "Confirmado",
    pending: "Pendiente",
    declined: "Rechazado",
  };

  const statusColors = {
    confirmed: "bg-green-500 text-white",
    pending: "bg-yellow-500 text-white",
    declined: "bg-red-500 text-white",
  };

  const typeIcons = {
    amigos: <Users className="w-6 h-6" />,
    principal: <Home className="w-6 h-6" />,
    familia: <User className="w-6 h-6" />,
    proveedores: <Briefcase className="w-6 h-6" />,
  };

  const typeColors = {
    amigos: "bg-blue-100 text-blue-800",
    principal: "bg-purple-100 text-purple-800",
    familia: "bg-pink-100 text-pink-800",
    proveedores: "bg-orange-100 text-orange-800",
  };

  const filteredGuests = guests.filter((guest) => {
    const searchLower = searchTerm.toLowerCase();
    const statusTranslated = statusTranslations[guest.status]?.toLowerCase() || "";
    
    return (
      guest.name?.toLowerCase().includes(searchLower) ||
      guest.email?.toLowerCase().includes(searchLower) ||
      guest.phone?.toLowerCase().includes(searchLower) ||
      guest.type?.toLowerCase().includes(searchLower) ||
      statusTranslated.includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por nombre, email, teléfono, tipo o estado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      {/* Tabla para pantallas grandes */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-bold">Nombre</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Teléfono</TableHead>
              <TableHead className="font-bold">Tipo</TableHead>
              <TableHead className="font-bold">Acompañantes</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="font-bold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest) => (
                <TableRow
                  key={guest.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>{guest.name}</TableCell>
                  <TableCell>{guest.email || "No disponible"}</TableCell>
                  <TableCell>{guest.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        typeColors[guest.type] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {guest.type
                        ? guest.type.charAt(0).toUpperCase() +
                          guest.type.slice(1)
                        : "Sin tipo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {guest.numberOfGuests !== null ? guest.numberOfGuests : 0}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusColors[guest.status] ||
                        "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {statusTranslations[guest.status] || "Desconocido"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(guest)}
                        className="hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(guest.id)}
                        className="hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSendCustomMessage(guest)}
                        className="hover:bg-purple-50"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500 italic"
                >
                  {searchTerm
                    ? "No se encontraron invitados que coincidan con la búsqueda"
                    : "No se han agregado invitados aún. ¡Invita a alguien para comenzar!"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Vista de lista para pantallas pequeñas */}
      <div className="md:hidden space-y-4">
        {filteredGuests.length > 0 ? (
          filteredGuests.map((guest) => (
            <div
              key={guest.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer flex items-center space-x-4"
                onClick={() => toggleExpand(guest.id)}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    typeColors[guest.type] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {typeIcons[guest.type] || <User className="w-6 h-6" />}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{guest.name}</h3>
                  <p className="text-sm text-gray-500">{guest.email || "No disponible"}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusColors[guest.status] || "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {statusTranslations[guest.status] || "Desconocido"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {guest.numberOfGuests !== null
                        ? `${guest.numberOfGuests} acompañantes`
                        : "Sin acompañantes"}
                    </span>
                  </div>
                </div>
                {expandedGuest === guest.id ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </div>
              {expandedGuest === guest.id && (
                <div className="p-4 bg-gray-50 border-t">
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Teléfono:</span>{" "}
                      {guest.phone}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(guest)}
                        className="hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(guest.id)}
                        className="hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSendCustomMessage(guest)}
                        className="hover:bg-purple-50"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Mensaje
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 italic">
            {searchTerm
              ? "No se encontraron invitados que coincidan con la búsqueda"
              : "No se han agregado invitados aún. ¡Invita a alguien para comenzar!"}
          </div>
        )}
      </div>
    </div>
  );
}
