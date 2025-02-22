import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function ConfirmacionEspecial({ isVisible, theme, invitadoNombre }) {
    useEffect(() => {
        if (isVisible) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
                >
                    <motion.div
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        className={`bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-auto border-t-4 border-${theme}-500`}
                    >
                        <h2 className={`text-3xl font-bold mb-4 text-${theme}-800`}>¡Gracias por confirmar, {invitadoNombre}!</h2>
                        <p className="text-xl mb-6">Estamos emocionados de que te unas a nuestra celebración.</p>
                        <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-${theme}-100 flex items-center justify-center`}>
                            <motion.svg
                                className={`w-24 h-24 text-${theme}-500`}
                                viewBox="0 0 24 24"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <motion.path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    d="M20 6L9 17l-5-5"
                                />
                            </motion.svg>
                        </div>
                        <p className={`text-${theme}-600 italic`}>"El amor no se mide por cuánto damos, sino por cuánto amor ponemos en dar."</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

