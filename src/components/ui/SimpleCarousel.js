"use client"

import { useState, useCallback, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function ImprovedCarousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const prevSlide = useCallback(
        (e) => {
            e?.preventDefault()
            e?.stopPropagation()
            setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
        },
        [images.length],
    )

    const nextSlide = useCallback(
        (e) => {
            e?.preventDefault()
            e?.stopPropagation()
            setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
        },
        [images.length],
    )

    useEffect(() => {
        if (isAutoPlaying) {
            const interval = setInterval(nextSlide, 5000)
            return () => clearInterval(interval)
        }
    }, [isAutoPlaying, nextSlide])

    if (images.length === 0) return null

    return (
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl shadow-lg">
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[currentIndex] || "/placeholder.svg"}
                        alt={`Slide ${currentIndex + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 flex items-center justify-between p-4">
                <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-white/30 text-white hover:bg-white/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-white/30 text-white hover:bg-white/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white scale-125" : "bg-white/50"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
            <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/30 text-white hover:bg-white/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
            >
                {isAutoPlaying ? "❚❚" : "▶"}
            </button>
        </div>
    )
}

