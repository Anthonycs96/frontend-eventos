export default function Input({
    label,
    name,
    type = "text",
    register,
    validation,
    error,
    ...props
}) {
    return (
        <div className="w-full space-y-1">
            {/* Label */}
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                    {label}
                </label>
            )}

            {/* Input */}
            <input
                id={name}
                name={name}
                type={type}
                aria-invalid={error ? "true" : "false"}
                {...(register ? register(name, validation) : {})} // Solo registra si se proporciona register
                className={`block w-full rounded-md border border-neutral-300 bg-white px-4 py-2
                      text-sm text-neutral-900 shadow-sm placeholder-neutral-400 transition-all duration-300
                      focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                      disabled:opacity-50 disabled:cursor-not-allowed
                      dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 ${props.className}`}
                {...props}
            />

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                    {error.message}
                </p>
            )}
        </div>
    );
}
