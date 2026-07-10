import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-saffron text-white border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#0a0a0a]",
  secondary:
    "bg-gold text-ink border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#0a0a0a]",
  ghost:
    "bg-bg-page text-ink border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a] hover:bg-white",
  danger:
    "bg-danger-extreme text-white border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a]",
  outline:
    "bg-white text-ink border-[3px] border-ink shadow-[3px_3px_0_0_#0a0a0a] hover:bg-gold",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs min-h-9",
  md: "px-5 py-2.5 text-sm min-h-11",
  lg: "px-7 py-3 text-base min-h-12",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-display uppercase tracking-wide transition-all duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron disabled:opacity-50 disabled:pointer-events-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#0a0a0a]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
