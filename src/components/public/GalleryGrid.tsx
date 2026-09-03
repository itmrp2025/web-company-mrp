"use client";

import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryPhoto {
  id: string;
  src: string;
  category: string;
  title: string;
  description: string;
  date: string;
}

interface GalleryGridProps {
  photos: GalleryPhoto[];
  categories: { key: string; label: string }[];
  allLabel: string;
  noPhotosLabel: string;
}

function PhotoModal({
  photo,
  onClose,
}: {
  photo: GalleryPhoto | null;
  onClose: () => void;
}) {
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image */}
        <div className="aspect-video w-full overflow-hidden bg-neutral-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Caption */}
        <div className="bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-label mb-1 text-neutral-400">{photo.category}</p>
              <h3 className="font-sans text-lg font-semibold text-neutral-900">{photo.title}</h3>
              {photo.description && (
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{photo.description}</p>
              )}
            </div>
            <span className="shrink-0 text-xs text-neutral-400">{photo.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryGrid({ photos, categories, allLabel, noPhotosLabel }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const filtered = activeCategory === "all"
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Category filter */}
      <div className="mb-10 flex gap-0 border-b border-neutral-100 overflow-x-auto">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "shrink-0 border-b-2 px-5 py-3 text-xs font-medium uppercase tracking-wider transition-colors",
            activeCategory === "all"
              ? "border-primary text-primary"
              : "border-transparent text-neutral-400 hover:text-neutral-700"
          )}
        >
          {allLabel}
        </button>
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              "shrink-0 border-b-2 px-5 py-3 text-xs font-medium uppercase tracking-wider transition-colors",
              activeCategory === key
                ? "border-primary text-primary"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-20 text-center text-neutral-400">{noPhotosLabel}</p>
      ) : (
        <div className="grid grid-cols-1 gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-[4/3] overflow-hidden bg-neutral-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/60 transition-colors duration-300" />
              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex h-10 w-10 items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30">
                  <ZoomIn className="h-5 w-5 text-white" />
                </div>
              </div>
              {/* Caption bar */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white px-4 py-3">
                <p className="section-label mb-0.5 text-neutral-400">{photo.category}</p>
                <p className="text-xs font-medium text-neutral-900 line-clamp-1">{photo.title}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </>
  );
}

