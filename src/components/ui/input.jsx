import { forwardRef } from "react";

const Input = forwardRef(({ className = "", error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-lg
          border-2 border-amber-200/50
          bg-white/80 backdrop-blur-sm
          text-gray-700 placeholder-amber-400/70
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400
          hover:border-amber-300
          ${
            error
              ? "border-red-300 focus:ring-red-200 focus:border-red-400"
              : ""
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="absolute -bottom-5 left-0 text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
