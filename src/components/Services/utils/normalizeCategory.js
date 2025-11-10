import { services } from "@/data/services";

export function normalizeCategory(category) {
  for (const service of services) {
    if (service.title === category) return category;
    if (service.aliases?.some((alias) => alias.name === category)) return service.title;
  }
  return category;
}
