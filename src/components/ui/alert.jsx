import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7 flex items-center justify-between",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground border-border dark:bg-background-dark dark:text-foreground-dark",
        destructive:
          "bg-destructive/10 border-destructive/50 text-destructive dark:border-destructive dark:bg-destructive/20 [&>svg]:text-destructive",
        success:
          "bg-green-500/10 border-green-500/50 text-green-600 dark:border-green-500 dark:bg-green-500/20 [&>svg]:text-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    className={cn(alertVariants({ variant }), className, "hover:shadow-md")}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };
