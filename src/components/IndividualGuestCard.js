"use client";

import { useState, useRef } from "react";
import { Camera, Download, CheckCircle, Instagram, XCircle, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import html2canvas from "html2canvas";

export default function IndividualGuestCard({ guest, onClose }) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareImage, setShareImage] = useState(null);
  const cardRef = useRef(null);
  const [activeTab, setActiveTab] = useState("classic");
  const [isCapturing, setIsCapturing] = useState(false);


  const statusIcons = {
    confirmed: <CheckCircle className="h-8 w-8 text-green-300" />,
    pending: <Clock className="h-8 w-8 text-yellow-300" />,
    declined: <XCircle className="h-8 w-8 text-red-300" />,
  };
  const statusTranslations = {
    confirmed: "Confirmado",
    pending: "Pendiente",
    declined: "Rechazado",
  };
  const formatGuestNames = () => {
    if (!guest.additionalGuestNames || guest.additionalGuestNames.length === 0) {
      return null; // No mostrar nada si no hay acompañantes
    }
    if (guest.additionalGuestNames.length === 1) {
      return guest.additionalGuestNames[0];
    }
    // Si hay más de un acompañante, usar "y" antes del último nombre
    const names = guest.additionalGuestNames.slice(0, -1).join(", ");
    return `${names} y ${guest.additionalGuestNames[guest.additionalGuestNames.length - 1]}.`;
  };
  
  const formatMessage = () => {
    if (!guest.personalMessage || guest.personalMessage.trim() === "") {
      return "Sin mensaje personal";
    }
    return guest.personalMessage;
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-transparent border-none">
        <DialogHeader>
          <DialogTitle className="sr-only">🕶️ Invitado VIP Confirmado 🕶️</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-6 text-white">
              <div className="text-center mb-4">
                <div className="inline-block bg-white/20 rounded-full p-2 mb-2">
                  {statusIcons[guest.status]}
                </div>
                <h3 className="text-2xl font-bold">🔥 {statusTranslations[guest.status]} 🔥</h3>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-center mb-3">
                  <h4 className="text-xl font-bold">
                    {guest.name}
                    {guest.numberOfGuests > 0 && formatGuestNames() && `, ${formatGuestNames()}`}
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-semibold text-blue-200">💬 Mensaje exclusivo:</div>
                    <div className="bg-white/10 rounded p-2 mt-1 max-h-64 overflow-y-auto">
                      {formatMessage()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-blue-100 mt-4">
                🥂 "Si no hay fiesta, la hacemos. Y si la hacemos, que sea legendaria."
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
);



}