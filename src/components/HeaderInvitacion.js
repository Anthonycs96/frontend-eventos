

export default function HeaderInvitacion({ invitado }) {
    // Verificar si invitado está cargado
    if (!invitado) {
        return (
            <div className="text-center mb-5">
                <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg mb-2">
                    ¡Te Invitamos!
                </h1>
                <p className="text-xl sm:text-2xl font-light text-white drop-shadow-md">
                    <span className="font-semibold">Cargando datos...</span>
                </p>
            </div>
        );
    }

    return (
        <div className="text-center mb-5"> {/* Se agregó margen inferior */}
            <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg mb-2">
                ¡Te Invitamos!
            </h1>
            <p className="text-xl sm:text-2xl font-light text-white drop-shadow-md">
                <span className="font-semibold">{invitado?.name || "Querido Invitado"}</span>, celebra con nosotros
            </p>
        </div>
    );
}
