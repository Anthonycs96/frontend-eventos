export default function Input({ label, name, type = "text", register, validation, error, ...props }) {
    return (
        <div className="w-full space-y-1">
            {/* Label */}
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            {/* Input */}
            <input
                id={name}
                name={name}
                type={type}
                {...(register ? register(name, validation) : {})} // Solo registra si se proporciona register
                className={`block w-full rounded-md border border-gray-300 bg-white px-4 py-2
                    text-sm text-gray-900 shadow-sm placeholder-gray-400
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                    disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400
                    ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                `}
                {...props} // Pasa cualquier otra prop adicional
            />

            {/* Mensaje de error */}
            {error && (
                <p className="text-sm text-red-600 mt-1">
                    {error.message}
                </p>
            )}
        </div>
    );
}