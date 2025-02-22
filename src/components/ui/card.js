export function Card({ children, className = "", onClick }) {
    return (
        <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, children, className = "" }) {
    return (
        <div className={`mb-4 ${className}`}>
            {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            {children}
        </div>
    );
}


export function CardContent({ children, className = "" }) {
    return <div className={`text-gray-700 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
    return <div className={`mt-4 flex justify-end space-x-2 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
    return (
        <h3 className={`text-xl font-bold text-gray-900 ${className}`}>
            {children}
        </h3>
    );
}
