import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-bold uppercase tracking-wide text-ink"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full border-[3px] border-ink bg-white px-3 py-2 text-sm font-medium text-ink placeholder:text-muted shadow-[2px_2px_0_0_#0a0a0a] focus:outline-none focus:ring-2 focus:ring-saffron",
            error && "border-danger-extreme",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-bold uppercase text-danger-extreme">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
