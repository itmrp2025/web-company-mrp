"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  emptyText?: string;
  /** Slot rendered after the option list — used for inline add/manage UI */
  footer?: React.ReactNode;
  /** Custom renderer for each option row — receives option + whether it's selected */
  renderOption?: (opt: SelectOption, selected: boolean) => React.ReactNode;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      label,
      placeholder = "Pilih...",
      error,
      helperText,
      disabled,
      id,
      className,
      emptyText = "Tidak ada data",
      footer,
      renderOption,
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value);
    const isError = !!error;

    // Close on outside click — capture phase so contains() runs before any stopPropagation
    React.useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", handler, true);
      return () => document.removeEventListener("mousedown", handler, true);
    }, [open]);

    // Close on Escape
    React.useEffect(() => {
      if (!open) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [open]);

    const handleSelect = (optValue: string) => {
      onChange?.(optValue);
      setOpen(false);
    };

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {/* External label — same structure as TextField */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium",
              isError ? "text-error" : "text-neutral-700",
            )}
          >
            {label}
          </label>
        )}

        {/* Positioning context — dropdown anchors here */}
        <div ref={containerRef} className="relative">
          <button
            ref={ref}
            id={inputId}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            disabled={disabled}
            onClick={() => !disabled && setOpen((o) => !o)}
            className={cn(
              "h-10 w-full rounded-md border bg-background px-3 pr-9 text-left text-sm outline-none transition-all focus:ring-1",
              isError
                ? "border-error focus:border-error focus:ring-error"
                : open
                  ? "border-primary ring-1 ring-primary"
                  : "border-input hover:border-neutral-400",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <span className={cn("block truncate", !selected && "text-neutral-500")}>
              {selected ? selected.label : placeholder}
            </span>

            <ChevronDown
              className={cn(
                "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-transform duration-150",
                open && "rotate-180 text-primary",
              )}
            />
          </button>

          {/* Dropdown — anchored to button */}
          {open && (
            <div
              role="listbox"
              className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg"
            >
              <ul className="max-h-56 overflow-y-auto py-1">
                {options.length === 0 ? (
                  <li className="px-3 py-3 text-center text-sm text-neutral-400">
                    {emptyText}
                  </li>
                ) : (
                  options.map((opt) => {
                    const isSelected = opt.value === value;
                    if (renderOption) {
                      return (
                        <li
                          key={opt.value}
                          role="option"
                          aria-selected={isSelected}
                          className={cn(
                            "flex cursor-pointer items-center transition-colors select-none",
                            isSelected ? "bg-primary/8" : "hover:bg-neutral-50",
                            opt.disabled && "cursor-not-allowed opacity-40",
                          )}
                        >
                          {renderOption(opt, isSelected)}
                        </li>
                      );
                    }
                    return (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => !opt.disabled && handleSelect(opt.value)}
                        className={cn(
                          "flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors select-none",
                          isSelected ? "bg-primary/8 text-primary font-medium" : "text-neutral-700 hover:bg-neutral-50",
                          opt.disabled && "cursor-not-allowed opacity-40",
                        )}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0 ml-2" />}
                      </li>
                    );
                  })
                )}
              </ul>

              {footer && (
                <div className="border-t border-neutral-100">{footer}</div>
              )}
            </div>
          )}
        </div>

        {/* Helper / error */}
        {(error || helperText) && (
          <p className={cn("text-xs", isError ? "text-error" : "text-neutral-500")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
