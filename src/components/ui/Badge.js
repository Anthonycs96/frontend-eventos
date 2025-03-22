export default function Badge({ children, className = "", variant = "default" }) {
    const baseStyle =
        "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-colors duration-300";

    const variants = {
        default: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        success: "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200",
        error: "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200",
        warning: "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200",
        info: "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200",
    };

    const variantStyle = variants[variant] || variants.default;

    return (
        <span className={`${baseStyle} ${variantStyle} ${className}`} role="status" aria-label="Badge">
            {children}
        </span>
    );
}
