import { cn } from "@/utils/cn";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const inputId = id || props.name || label;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm text-muted">
          {label}
        </label>
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-2xl border border-white/[0.06] bg-card/60 px-4 text-foreground transition-colors appearance-none",
            "hover:border-accent/20 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/15",
            error && "border-danger/40",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </div>
    );
  },
);

Select.displayName = "Select";
