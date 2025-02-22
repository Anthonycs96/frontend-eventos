export default function Button({
    children,
    onClick,
    type = "button",
    className = "",
    isLoading = false
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:pointer-events-none ${className}`}
            disabled={isLoading}
        >
            {isLoading ? (
                <span className="flex items-center">
                    <svg
                        className="animate-spin h-5 w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4zm2 5.29A7.96 7.96 0 004 12h2v5.29z"
                        ></path>
                    </svg>
                    Cargando...
                </span>
            ) : (
                children
            )}
        </button>
    );
}
