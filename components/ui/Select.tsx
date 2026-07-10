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
            "w-full min-h-11 appearance-none border-[3px] border-ink bg-white bg-[length:14px] bg-[right_0.75rem_center] bg-no-repeat px-3 py-2.5 pr-10 text-sm font-bold text-ink shadow-[3px_3px_0_0_#0a0a0a] focus:outline-none focus:ring-2 focus:ring-saffron",
            "bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230a0a0a%22 stroke-width=%223%22%3E%3Cpath d=%22M6 9l6 6 6-6%22/%3E%3C/svg%3E')]",
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
