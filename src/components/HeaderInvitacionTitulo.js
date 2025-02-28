// import dancingScript from "@/styles/fonts";

export default function HeaderInvitacionTitulo({ evento, fontClass }) {
    // Verificar si evento existe y si tiene la propiedad description
    const title = evento?.description || "Te Invitamos";

    return (
        <div className="text-center mb-5"> {/* Se agregó margen inferior */}
            <h1 className={`text-6xl sm:text-7xl lg:text-8xl font-bold text-white drop-shadow-lg mb-2 ${fontClass}
               
                
                `}>
                {title}
            </h1>
        </div>

    );
}
