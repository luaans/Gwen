import { cn } from "@/utils/cn";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name || label;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm text-muted">
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-28 w-full rounded-2xl border border-white/[0.06] bg-card/60 px-4 py-3 text-foreground placeholder:text-muted/60 transition-colors resize-y",
            "hover:border-accent/20 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/15",
            error && "border-danger/40",
            className,
          )}
          {...props}
        />
        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
