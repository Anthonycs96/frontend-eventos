import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Clock, UserX } from "lucide-react";

export default function StatsModal({ isOpen, onClose, stats }) {
    if (!stats) return null;

    const statCards = [
        {
            title: "Total posibles asistentes",
            value: stats.totalGeneralWithAccompanying,
            icon: <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />,
            description: "Suma de confirmados y pendientes (con acompañantes)",
            color: "bg-blue-100 dark:bg-blue-900",
            textColor: "text-blue-800 dark:text-blue-200",
            borderColor: "border-blue-200 dark:border-blue-700"
        },
        {
            title: "Confirmados + acompañantes",
            value: stats.totalConfirmedWithAccompanying,
            icon: <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />,
            description: "Invitados confirmados y sus acompañantes",
            color: "bg-green-100 dark:bg-green-900",
            textColor: "text-green-800 dark:text-green-200",
            borderColor: "border-green-200 dark:border-green-700"
        },
        {
            title: "Pendientes + acompañantes",
            value: stats.totalPendingWithAccompanying,
            icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />,
            description: "Invitados pendientes y sus acompañantes",
            color: "bg-yellow-100 dark:bg-yellow-900",
            textColor: "text-yellow-800 dark:text-yellow-200",
            borderColor: "border-yellow-200 dark:border-yellow-700"
        },
        {
            title: "Rechazados + acompañantes",
            value: stats.totalDeclinedWithAccompanying,
            icon: <UserX className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />,
            description: "Personas que no asistirán al evento",
            color: "bg-red-100 dark:bg-red-900",
            textColor: "text-red-800 dark:text-red-200",
            borderColor: "border-red-200 dark:border-red-700"
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-4xl max-h-[70vh] overflow-y-auto scrollbar-custom bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                <style jsx global>{`
                    .scrollbar-custom {
                        scrollbar-width: thin;
                        scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
                    }
                    .scrollbar-custom::-webkit-scrollbar {
                        width: 6px;
                    }
                    .scrollbar-custom::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .scrollbar-custom::-webkit-scrollbar-thumb {
                        background-color: rgba(155, 155, 155, 0.5);
                        border-radius: 20px;
                        border: transparent;
                    }
                    .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                        background-color: rgba(155, 155, 155, 0.7);
                    }
                `}</style>

                <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                    <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Estadísticas del Evento
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
                    {statCards.map((stat, index) => (
                        <Card key={index} className={`${stat.color} border-none shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl`}>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    {stat.icon}
                                    <span className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}>
                                        {stat.value}
                                    </span>
                                </div>
                                <h3 className={`text-base sm:text-lg font-semibold mb-2 ${stat.textColor}`}>
                                    {stat.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
