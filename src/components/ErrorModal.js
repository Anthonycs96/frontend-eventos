import Modal from './Modal';
import { XCircle } from 'lucide-react';

export default function ErrorModal({ isOpen, onClose, errors = [] }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-4 text-red-500">
                    <XCircle className="h-8 w-8" />
                    <span className="text-xl font-medium">Validation Error</span>
                </div>
            }
        >
            <div className="py-6 px-5   flex flex-col items-center">
                {errors.length > 0 ? (
                    <ul className="space-y-4">
                        {errors.map((error, index) => (
                            <li key={index} className="flex items-start">
                                <span className="bg-red-500 text-white font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3">!</span>
                                <p className="text-gray-900 text-sm font-medium">{error}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center text-sm">No errors found.</p>
                )}
            </div>
            <div className="absolute top-3 right-3">

            </div>
        </Modal>
    );
}
