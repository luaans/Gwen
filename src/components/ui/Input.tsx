import { cn } from "@/utils/cn";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name || label;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm text-muted">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-2xl border border-white/[0.06] bg-card/60 px-4 text-foreground placeholder:text-muted/60 transition-colors",
            "hover:border-accent/20 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/15",
            error && "border-danger/40",
            className,
          )}
          {...props}
        />
        {hint && !error ? (
          <p className="text-xs text-muted/80">{hint}</p>
        ) : null}
        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </div>
    );
  },
);

Input.displayName = "Input";
