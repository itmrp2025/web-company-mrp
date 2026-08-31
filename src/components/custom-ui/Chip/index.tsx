import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        filled: "text-white",
        outlined: "border bg-transparent",
      },
      color: {
        primary: "",
        accent: "",
        neutral: "",
        success: "",
        warning: "",
        error: "",
      },
    },
    compoundVariants: [
      { variant: "filled", color: "primary", class: "bg-primary" },
      { variant: "filled", color: "accent", class: "bg-accent" },
      { variant: "filled", color: "neutral", class: "bg-neutral-500" },
      { variant: "filled", color: "success", class: "bg-success" },
      { variant: "filled", color: "warning", class: "bg-warning" },
      { variant: "filled", color: "error", class: "bg-error" },
      {
        variant: "outlined",
        color: "primary",
        class: "border-primary text-primary",
      },
      {
        variant: "outlined",
        color: "accent",
        class: "border-accent text-accent",
      },
      {
        variant: "outlined",
        color: "neutral",
        class: "border-neutral-200 text-neutral-700",
      },
      {
        variant: "outlined",
        color: "success",
        class: "border-success text-success",
      },
      {
        variant: "outlined",
        color: "warning",
        class: "border-warning text-warning",
      },
      { variant: "outlined", color: "error", class: "border-error text-error" },
    ],
    defaultVariants: {
      variant: "filled",
      color: "neutral",
    },
  },
);

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode;
  onDelete?: () => void;
}

export function Chip({
  className,
  variant,
  color,
  icon,
  onDelete,
  children,
  ...props
}: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant, color }), className)} {...props}>
      {icon}
      {children}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="ml-0.5 rounded-full hover:opacity-70"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
