export const SERVICE_SLUGS = [
  "litigation",
  "corporate",
  "regulatory",
  "professional",
  "ecommerce",
  "property",
  "family",
  "employment",
  "intellectual",
  "immigration",
  "environmental",
  "criminal",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const isServiceSlug = (value: string): value is ServiceSlug =>
  (SERVICE_SLUGS as readonly string[]).includes(value);