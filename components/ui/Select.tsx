import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, placeholder, ...props }, ref) => {
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
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full border-[3px] border-ink bg-white px-3 py-2 text-sm font-medium text-ink shadow-[2px_2px_0_0_#0a0a0a] focus:outline-none focus:ring-2 focus:ring-saffron",
            error && "border-danger-extreme",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs font-bold uppercase text-danger-extreme">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
