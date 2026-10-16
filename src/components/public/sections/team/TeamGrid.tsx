import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface Attorney {
  id: string;
  slug: string;
  name: string;
  title: string;
  roleType: "founder" | "associate";
  photo: string;
  bio: { id: string; en: string };
  credentials: string[];
  specializations: string[];
  linkedin?: string;
  instagram?: string;
  email?: string;
}

interface Labels {
  founderLabel: string;
  associatesLabel: string;
  viewProfileLabel: string;
  founderBadge: string;
}

function AttorneyCard({ attorney, labels }: { attorney: Attorney; labels: Labels }) {
  return (
    <Link
      href={`/our-team/${attorney.slug}`}
      className="group block w-full overflow-hidden rounded-xl border border-neutral-100 bg-white text-left transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
    >
      <div className="relative aspect-3/4 overflow-hidden">
        {attorney.photo ? (
          <Image
            src={attorney.photo}
            alt={attorney.name}
            fill
            unoptimized
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100">
            <span className="text-4xl font-semibold text-neutral-300">
              {attorney.name?.charAt(0) ?? "?"}
            </span>
          </div>
        )}

        {attorney.roleType === "founder" && (
          <div className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            {labels.founderBadge}
          </div>
        )}

        {/* Perangkat dengan mouse: tulisan muncul saat hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
            {labels.viewProfileLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-sans text-sm font-semibold leading-snug text-neutral-900">
          {attorney.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-primary">{attorney.title}</p>
        {attorney.specializations.length > 0 && (
          <p className="mt-2 truncate text-[10px] text-neutral-500">
            {attorney.specializations.slice(0, 2).join(" · ")}
          </p>
        )}

        {/* Layar sentuh (tanpa hover): tulisan selalu terlihat */}
        <span className="mt-3 hidden items-center gap-1.5 text-xs font-semibold text-primary [@media(hover:none)]:inline-flex">
          {labels.viewProfileLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

interface Props {
  attorneys: Attorney[];
  labels: Labels;
  locale: "id" | "en";
}

export function TeamGrid({ attorneys, labels }: Props) {
  const founders = attorneys.filter((a) => a.roleType === "founder");
  const associates = attorneys.filter((a) => a.roleType === "associate");

  return (
    <>
      {founders.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="section-label mb-10 text-center">{labels.founderLabel}</p>
            <div className="flex flex-wrap justify-center gap-5">
              {founders.map((a) => (
                <div key={a.id} className="w-full max-w-xs sm:max-w-sm">
                  <AttorneyCard attorney={a} labels={labels} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {associates.length > 0 && (
        <section className="bg-neutral-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="section-label mb-10">{labels.associatesLabel}</p>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {associates.map((a) => (
                <AttorneyCard key={a.id} attorney={a} labels={labels} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}