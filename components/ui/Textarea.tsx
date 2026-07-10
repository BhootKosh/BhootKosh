import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full min-h-[120px] border-[3px] border-ink bg-white px-3 py-2 text-sm font-medium text-ink placeholder:text-muted shadow-[2px_2px_0_0_#0a0a0a] focus:outline-none focus:ring-2 focus:ring-saffron",
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
Textarea.displayName = "Textarea";
