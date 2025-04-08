export default function Statistics({ totalEvents, totalInvitations, confirmedInvitations }) {
    return (
        <div className="shadow-md rounded-lg p-6 mb-8 bg-[var(--card-background)]">
            <h2 className="text-2xl font-semibold mb-4">Estadísticas Generales</h2>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <p className="text-[var(--text-primary)]">Total de Eventos</p>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{totalEvents}</p>
                </div>
                <div>
                    <p className="text-[var(--text-primary)]">Invitaciones Enviadas</p>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{totalInvitations}</p>
                </div>
                <div>
                    <p className="text-[var(--text-primary)]">Invitaciones Confirmadas</p>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{confirmedInvitations}</p>
                </div>
            </div>
        </div>
    )
}

