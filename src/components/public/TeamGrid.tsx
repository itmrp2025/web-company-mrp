"use client";

import { useState } from "react";
import { Avatar } from "@/components/custom-ui/Avatar";
import { TeamMemberModal, type TeamMember } from "./TeamMemberModal";

interface TeamGridProps {
  founder: TeamMember;
  members: TeamMember[];
  associatesLabel: string;
  socialsLabel: string;
  viewProfileLabel: string;
  viewProfileShortLabel: string;
}

function MemberCard({
  member,
  onClick,
  large = false,
  viewProfileLabel,
  viewProfileShortLabel,
}: {
  member: TeamMember;
  onClick: () => void;
  large?: boolean;
  viewProfileLabel: string;
  viewProfileShortLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full text-left bg-white hover:bg-neutral-50 transition-colors cursor-pointer ${large ? "p-8 lg:p-12" : "p-6"}`}
    >
      <div className={`flex ${large ? "flex-col gap-8 sm:flex-row sm:items-center" : "flex-col items-center text-center"}`}>
        <div className={`shrink-0 ${large ? "flex justify-center sm:justify-start" : "flex justify-center mb-4"}`}>
          <Avatar
            fallback={member.name}
            size="xl"
            className={large ? "h-24 w-24 text-2xl" : "h-16 w-16 text-xl"}
          />
        </div>
        <div className={large ? "" : "w-full"}>
          <span className="section-label mb-2 block">{member.role}</span>
          <h3 className={`font-semibold text-neutral-900 group-hover:text-primary transition-colors ${large ? "font-sans text-2xl mb-1" : "text-sm mb-0.5"}`}>
            {member.name}
          </h3>
          <p className={`text-neutral-400 ${large ? "text-sm mb-4" : "text-xs mt-0.5"}`}>{member.title}</p>
          <p className={`text-neutral-600 leading-relaxed ${large ? "" : "text-xs mt-3 line-clamp-3"}`}>{member.bio}</p>
          <div className={`flex flex-wrap gap-1.5 mt-4 ${large ? "" : "justify-center"}`}>
            {member.specs.map((s) => (
              <span key={s} className={`border border-neutral-100 text-neutral-400 ${large ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]"}`}>
                {s}
              </span>
            ))}
          </div>
          {!large && (
            <p className="mt-4 text-[10px] uppercase tracking-wider text-primary/70 group-hover:text-primary transition-colors">
              {viewProfileShortLabel} â†’
            </p>
          )}
        </div>
      </div>
      {large && (
        <p className="mt-4 text-xs uppercase tracking-wider text-primary/60 group-hover:text-primary transition-colors sm:ml-32 sm:pl-8">
          {viewProfileLabel} â†’
        </p>
      )}
    </button>
  );
}

export function TeamGrid({
  founder,
  members,
  associatesLabel,
  socialsLabel,
  viewProfileLabel,
  viewProfileShortLabel,
}: TeamGridProps) {
  const [selected, setSelected] = useState<TeamMember | null>(null);

  return (
    <>
      {/* Founder highlight */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border border-neutral-100">
            <MemberCard
              member={founder}
              onClick={() => setSelected(founder)}
              large
              viewProfileLabel={viewProfileLabel}
              viewProfileShortLabel={viewProfileShortLabel}
            />
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="pb-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-8">{associatesLabel}</p>
          <div className="grid grid-cols-1 gap-px bg-neutral-100 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member) => (
              <MemberCard
                key={member.slug}
                member={member}
                onClick={() => setSelected(member)}
                viewProfileLabel={viewProfileLabel}
                viewProfileShortLabel={viewProfileShortLabel}
              />
            ))}
          </div>
        </div>
      </section>

      <TeamMemberModal
        member={selected}
        onClose={() => setSelected(null)}
        socialsLabel={socialsLabel}
      />
    </>
  );
}

