import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        contained: "text-white shadow-sm hover:opacity-90",
        outlined: "border bg-transparent hover:bg-neutral-50",
        text: "bg-transparent hover:bg-neutral-50",
      },
      color: {
        primary: "",
        accent: "",
        neutral: "",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    compoundVariants: [
      { variant: "contained", color: "primary", class: "bg-primary" },
      { variant: "contained", color: "accent", class: "bg-accent" },
      { variant: "contained", color: "neutral", class: "bg-neutral-900" },
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
        class: "border-neutral-200 text-neutral-900",
      },
      { variant: "text", color: "primary", class: "text-primary" },
      { variant: "text", color: "accent", class: "text-accent" },
      { variant: "text", color: "neutral", class: "text-neutral-900" },
    ],
    defaultVariants: {
      variant: "contained",
      color: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      color,
      size,
      loading,
      startIcon,
      endIcon,
      children,
      disabled,
      href,
      ...props
    },
    ref,
  ) => {
    const cls = cn(buttonVariants({ variant, color, size }), className);
    const content = (
      <>
        {loading ? <Loader2 className="size-4 animate-spin" /> : startIcon}
        {children}
        {!loading && endIcon}
      </>
    );

    if (href) {
      return (
        <Link href={href as Parameters<typeof Link>[0]["href"]} className={cls}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={cls}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    );
  },
);
Button.displayName = "Button";
