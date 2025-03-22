export function Card({ children, className = "", onClick }) {
    return (
        <div
            className={`card rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg bg-[var(--background-secondary)]
          text-[var(--foreground)]${className}`}
            onClick={onClick}
            role="region"
            aria-label="Card"
        >
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, children, className = "" }) {
    return (
        <div className={`mb-4 ${className}`}>
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
            {children}
        </div>
    );
}

export function CardContent({ children, className = "" }) {
    return <div className={`text-sm ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
    return (
        <div className={`mt-4 flex justify-end space-x-2 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = "" }) {
    return <h3 className={`text-xl font-bold ${className}`}>{children}</h3>;
}
