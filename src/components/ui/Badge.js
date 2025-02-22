export default function Badge({ children, className = "", variant = "default" }) {
    const baseStyle =
        "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full";

    const variants = {
        default: "bg-gray-200 text-gray-800",
        success: "bg-green-200 text-green-800",
        error: "bg-red-200 text-red-800",
        warning: "bg-yellow-200 text-yellow-800",
        info: "bg-blue-200 text-blue-800",
    };

    const variantStyle = variants[variant] || variants.default;

    return (
        <span className={`${baseStyle} ${variantStyle} ${className}`}>
            {children}
        </span>
    );
}
