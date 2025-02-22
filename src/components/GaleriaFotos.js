import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GaleriaFotos({ evento = {} }) {
    // Obtener secondaryImages de evento
    const secondaryImages = evento.secondaryImages || [];
    console.log("secondaryImages en GaleriaFotos:", secondaryImages);

    // Si no hay secondaryImages, utiliza una imagen placeholder
    const images = secondaryImages.length > 0 ? secondaryImages : ["/placeholder.svg?height=300&width=400"];

    // Estado para llevar el índice actual
    const [currentIndex, setCurrentIndex] = useState(0);

    // Función para ir a la siguiente imagen
    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Función para ir a la imagen anterior
    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    // Componente de renderizado
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 overflow-hidden border-t-4">
            <div className="border-t border-gray-300 flex-grow"></div>
            <h3 className="font-bold text-center">Nuestra Historia</h3>
            <div className="border-t border-gray-300 flex-grow"></div>
            <div className="relative h-64">
                {images[currentIndex] && (
                    <Image
                        src={images[currentIndex]}
                        alt={`Imagen ${currentIndex + 1}`}
                        layout="fill"
                        objectFit="cover"
                    />
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2"
                >
                    &#8249;
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2"
                >
                    &#8250;
                </button>
            </div>
        </div>
    );
}
