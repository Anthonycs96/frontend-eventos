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
  CheckCircle,
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
    <TableHead className="font-bold whitespace-nowrap">
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4" />
        <span>N° Invitados</span>
      </div>
    </TableHead>
    <TableHead className="font-bold whitespace-nowrap">
      <div className="flex items-center gap-1">
        <CheckCircle className="h-4 w-4" />
        <span>Nombres Invitados</span>
      </div>
    </TableHead>
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
                  {Array.isArray(guest.additionalGuestNames) && guest.additionalGuestNames.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {guest.additionalGuestNames.map((name, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-sm"
                            >
                              {name.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Ninguno</span>
                      )}
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
      <div className="md:hidden space-y-3">
        {filteredGuests.length > 0 ? (
          filteredGuests.map((guest) => (
            <div
              key={guest.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleExpand(guest.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      typeColors[guest.type] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {typeIcons[guest.type] || <User className="w-5 h-5" />}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium text-gray-900 truncate">{guest.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[guest.status] || "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {statusTranslations[guest.status] || "Desconocido"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <span>{guest.type ? guest.type.charAt(0).toUpperCase() + guest.type.slice(1) : "Sin tipo"}</span>
                      <span>•</span>
                      <span>{guest.numberOfGuests !== null ? `N° Invitados ${guest.numberOfGuests}` : "Sin acompañantes"}</span>
                    </div>
                  </div>
                  <div className="transition-transform duration-200" style={{ transform: expandedGuest === guest.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  expandedGuest === guest.id ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">Teléfono:</span>
                    <span className="text-gray-600">{guest.phone || "No disponible"}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Acompañantes confirmados:</span>
                    <div className="mt-1">
                      {Array.isArray(guest.additionalGuestNames) && guest.additionalGuestNames.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {guest.additionalGuestNames.map((name, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-sm"
                            >
                              {name.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Ninguno</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(guest)}
                      className="flex-1 justify-center hover:bg-blue-50 min-w-[100px]"
                    >
                      <Edit className="h-4 w-4 mr-1.5" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(guest.id)}
                      className="flex-1 justify-center hover:bg-red-50 min-w-[100px]"
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      Eliminar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSendCustomMessage(guest)}
                      className="flex-1 justify-center hover:bg-purple-50 min-w-[100px]"
                    >
                      <MessageSquare className="h-4 w-4 mr-1.5" />
                      Mensaje
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 px-4 rounded-lg bg-gray-50 border border-gray-100">
            <div className="text-gray-500 italic">
              {searchTerm
                ? "No se encontraron invitados que coincidan con la búsqueda"
                : "No se han agregado invitados aún. ¡Invita a alguien para comenzar!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
