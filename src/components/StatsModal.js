import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ChartPie, Users, UserCheck, UserPlus, Clock } from "lucide-react";

export default function StatsModal({ isOpen, onClose, stats }) {
    if (!stats) return null;

    const statCards = [
        {
            title: "Total de Invitados",
            value: stats.totalGuests,
            icon: <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />,
            description: "Número total de invitados registrados",
            color: "bg-blue-50",
            textColor: "text-blue-700"
        },
        {
            title: "Confirmados",
            value: stats.totalConfirmedGuests,
            icon: <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />,
            description: "Invitados que han confirmado su asistencia",
            color: "bg-green-50",
            textColor: "text-green-700"
        },
        {
            title: "Acompañantes Confirmados",
            value: stats.totalConfirmedAccompanying,
            icon: <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />,
            description: "Total de acompañantes confirmados",
            color: "bg-purple-50",
            textColor: "text-purple-700"
        },
        {
            title: "Total Confirmados + Acompañantes",
            value: stats.totalConfirmedWithAccompanying,
            icon: <ChartPie className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />,
            description: "Suma total de invitados y acompañantes confirmados",
            color: "bg-indigo-50",
            textColor: "text-indigo-700"
        },
        {
            title: "Pendientes",
            value: stats.totalPendingGuests,
            icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />,
            description: "Invitados que aún no han confirmado",
            color: "bg-yellow-50",
            textColor: "text-yellow-700"
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-4xl max-h-[70vh] overflow-y-auto scrollbar-custom">
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
                <DialogHeader className="sticky top-0 rounded-lg z-10 pb-4 border-b bg-white">
                    <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                        <ChartPie className="h-5 w-5 sm:h-6 sm:w-6" />
                        Estadísticas Detalladas
                    </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-2 sm:p-4">
                    {statCards.map((stat, index) => (
                        <Card key={index} className={`${stat.color} border-none shadow-sm hover:shadow-md transition-shadow duration-200`}>
                            <CardContent className="p-3 sm:p-6">
                                <div className="flex items-center justify-between mb-2 sm:mb-4">
                                    {stat.icon}
                                    <span className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}>
                                        {stat.value}
                                    </span>
                                </div>
                                <h3 className={`text-sm sm:text-base font-semibold mb-1 sm:mb-2 ${stat.textColor}`}>
                                    {stat.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-2 sm:mt-4 p-2 sm:p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Resumen de Acompañantes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                            <p className="text-xs sm:text-sm text-gray-600">Acompañantes Pendientes</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-800">{stats.totalPendingAccompanying}</p>
                        </div>
                        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                            <p className="text-xs sm:text-sm text-gray-600">Total Pendientes + Acompañantes</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-800">{stats.totalPendingWithAccompanying}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
