import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge: string;
  heading: string;
  subheading?: string;
  imageUrl: string;
  children?: React.ReactNode;
  /**
   * `dark`/`darker` menutup gambar dengan warna rata.
   * `gradient` menjaga gambar tetap terlihat — gelap hanya di bagian bawah
   * tempat teks berada. Dipakai halaman detail artikel.
   */
  overlay?: "dark" | "darker" | "gradient";
  /** Override ukuran/lebar heading — dipakai halaman detail artikel yang judulnya panjang. */
  headingClassName?: string;
}

export function PageHero({
  badge,
  heading,
  subheading,
  imageUrl,
  children,
  overlay = "dark",
  headingClassName,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-neutral-900 py-28 text-white sm:py-36 lg:py-40">
      <Image
        src={imageUrl}
        alt=""
        fill
        unoptimized
        priority
        aria-hidden
        className="object-cover object-center"
        sizes="100vw"
      />
      {overlay === "gradient" ? (
        <>
          {/* Gambar tetap terbaca — gelap hanya cukup untuk kontras teks */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/55 to-neutral-950/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 to-transparent" />
        </>
      ) : (
        <>
          <div
            className={`absolute inset-0 ${
              overlay === "darker" ? "bg-neutral-950/85" : "bg-neutral-900/75"
            }`}
          />
          {/* Subtle bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950/40 to-transparent" />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="section-label mb-5 text-neutral-400">{badge}</p>
        <h1
          className={cn(
            "mb-6 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl",
            headingClassName,
          )}
        >
          {heading}
        </h1>
        {subheading && (
          <p className="max-w-2xl text-lg text-neutral-300 leading-relaxed">
            {subheading}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
