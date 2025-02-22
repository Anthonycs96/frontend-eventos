import { useState } from "react";

export function TooltipProvider({ children }) {
    return <div className="relative inline-block">{children}</div>;
}

export function TooltipTrigger({ children, onHover }) {
    return (
        <div
            className="cursor-pointer"
            onMouseEnter={onHover}
            onFocus={onHover}
            onMouseLeave={onHover}
            onBlur={onHover}
        >
            {children}
        </div>
    );
}

export function TooltipContent({ children, isVisible }) {
    return (
        isVisible && (
            <div className="absolute z-10 p-2 bg-gray-800 text-white text-sm rounded shadow-lg mt-2">
                {children}
            </div>
        )
    );
}
