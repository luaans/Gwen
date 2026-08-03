"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import type { SelectOption } from "@/lib/form-options";

interface MultiSelectProps {
  label: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecionar…",
  hint,
  error,
  optional,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuHeight = 224;

    setDropUp(spaceBelow < menuHeight && spaceAbove > spaceBelow);
  }, [open]);

  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
      return;
    }
    onChange([...value, optionValue]);
  }

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  return (
    <div ref={rootRef} className="relative flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm text-muted">{label}</label>
        {optional ? (
          <span className="text-[11px] text-muted/70">Opcional</span>
        ) : null}
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-card/60 px-4 py-2.5 text-left transition",
          "hover:border-accent/25 hover:bg-card",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
          open && "border-accent/30 bg-card",
          error && "border-danger/40",
        )}
      >
        <span
          className={cn(
            "line-clamp-2 text-sm",
            selectedLabels.length ? "text-foreground" : "text-muted/70",
          )}
        >
          {selectedLabels.length
            ? selectedLabels.join(", ")
            : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition",
            open && "rotate-180 text-accent",
          )}
        />
      </button>

      {open ? (
        <div
          id={listId}
          className={cn(
            "absolute left-0 right-0 z-40 max-h-56 overflow-auto rounded-2xl border border-white/[0.06] bg-[#121218] p-1.5 shadow-xl shadow-black/40",
            dropUp
              ? "bottom-[calc(100%+0.35rem)]"
              : "top-[calc(100%+0.35rem)]",
          )}
        >
          {options.map((option) => {
            const selected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggle(option.value)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                  selected
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-white/[0.04] hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-4 w-4 items-center justify-center rounded-md border border-white/10",
                    selected && "border-accent bg-accent text-[#0B0B0F]",
                  )}
                >
                  {selected ? <Check className="h-3 w-3" /> : null}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {hint && !error ? (
        <p className="text-xs text-muted/75">{hint}</p>
      ) : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
