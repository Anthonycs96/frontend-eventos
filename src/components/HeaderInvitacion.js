

export default function HeaderInvitacion({ invitado, fontClass }) {
    // Verificar si invitado está cargado
    if (!invitado) {
        return (
            <div className={`text-center mb-5  ${fontClass}`}>
                <h1 className={`text-4xl sm:text-5xl font-bold text-black drop-shadow-lg mb-2`}>
                    ¡Te Invitamos!
                </h1>
                <p className="text-xl sm:text-2xl font-light text-black drop-shadow-md">
                    <span className="font-semibold">Cargando datos...</span>
                </p>
            </div>
        );
    }

    return (
        <div className={`text-center mb-5  ${fontClass}`}> {/* Se agregó margen inferior */}
            <h1 className="text-4xl sm:text-5xl font-bold text-black drop-shadow-lg mb-2">
                ¡Te Invitamos!
            </h1>
            <p className="text-xl sm:text-2xl font-light text-black drop-shadow-md">
                <span className="font-semibold">{invitado?.name || "Querido Invitado"}</span>, celebra con nosotros
            </p>
        </div>
    );
}
