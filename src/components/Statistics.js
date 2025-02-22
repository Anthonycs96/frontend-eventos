export default function Statistics({ totalEvents, totalInvitations, confirmedInvitations }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Estadísticas Generales</h2>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <p className="text-gray-600">Total de Eventos</p>
                    <p className="text-3xl font-bold">{totalEvents}</p>
                </div>
                <div>
                    <p className="text-gray-600">Invitaciones Enviadas</p>
                    <p className="text-3xl font-bold">{totalInvitations}</p>
                </div>
                <div>
                    <p className="text-gray-600">Invitaciones Confirmadas</p>
                    <p className="text-3xl font-bold">{confirmedInvitations}</p>
                </div>
            </div>
        </div>
    )
}

