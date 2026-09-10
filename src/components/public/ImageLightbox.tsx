"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageLightboxProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  closeLabel?: string;
}

export function ImageLightbox({
  open,
  onClose,
  src,
  alt,
  closeLabel = "Tutup",
}: ImageLightboxProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm" />

      <button
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative z-10 max-h-full w-full max-w-5xl">
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          unoptimized
          className="h-auto max-h-[85vh] w-full object-contain"
        />
        <p className="mt-3 text-center text-xs text-neutral-400">{alt}</p>
      </div>
    </div>
  );
}
