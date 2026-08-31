import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    { className, label, error, helperText, startAdornment, endAdornment, id, ...props },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startAdornment && (
            <span className="absolute left-3 flex items-center text-neutral-500">
              {startAdornment}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
              startAdornment && "pl-9",
              endAdornment && "pr-9",
              error && "border-error focus:border-error focus:ring-error",
              className,
            )}
            {...props}
          />
          {endAdornment && (
            <span className="absolute right-3 flex items-center text-neutral-500">
              {endAdornment}
            </span>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn("text-xs", error ? "text-error" : "text-neutral-500")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);
TextField.displayName = "TextField";
