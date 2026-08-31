import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-20 text-2xl",
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: keyof typeof sizeMap;
  fallback?: string;
}

export function Avatar({
  className,
  src,
  alt = "",
  size = "md",
  fallback,
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100 font-medium text-neutral-700",
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <span>{fallback?.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}
