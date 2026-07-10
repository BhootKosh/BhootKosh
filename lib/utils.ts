import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugifyLib from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSlug(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function sanitizeSlug(slug: string): string {
  return createSlug(slug);
}

export function getPagination(page: number, pageSize: number) {
  const safePage = Math.max(1, page || 1);
  const safeSize = Math.min(50, Math.max(1, pageSize || 12));
  return {
    page: safePage,
    pageSize: safeSize,
    skip: (safePage - 1) * safeSize,
    take: safeSize,
  };
}

export function getTotalPages(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function truncate(text: string, length = 160) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

export function dangerLabel(level: string): string {
  const map: Record<string, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    EXTREME: "Extreme",
    UNKNOWN: "Unknown",
  };
  return map[level] || level;
}

export function ghostTypeLabel(type: string): string {
  const map: Record<string, string> = {
    FEMALE_SPIRITS: "Female Spirits",
    RESTLESS_DEAD: "Restless Dead",
    DEMONS: "Demons",
    FOREST_SPIRITS: "Forest Spirits",
    RIVER_SPIRITS: "River Spirits",
    VILLAGE_SPIRITS: "Village Spirits",
    SHAPE_SHIFTERS: "Shape-shifters",
    HAUNTED_PLACES: "Haunted Places",
    MYTHOLOGICAL_BEINGS: "Mythological Beings",
    POSSESSION_LEGENDS: "Possession Legends",
  };
  return map[type] || type;
}

export function ghostTypeSlug(type: string): string {
  return type.toLowerCase().replace(/_/g, "-");
}

export function ghostTypeFromSlug(slug: string): string | null {
  const upper = slug.toUpperCase().replace(/-/g, "_");
  const valid = [
    "FEMALE_SPIRITS",
    "RESTLESS_DEAD",
    "DEMONS",
    "FOREST_SPIRITS",
    "RIVER_SPIRITS",
    "VILLAGE_SPIRITS",
    "SHAPE_SHIFTERS",
    "HAUNTED_PLACES",
    "MYTHOLOGICAL_BEINGS",
    "POSSESSION_LEGENDS",
  ];
  return valid.includes(upper) ? upper : null;
}

export const GHOST_TYPES = [
  "FEMALE_SPIRITS",
  "RESTLESS_DEAD",
  "DEMONS",
  "FOREST_SPIRITS",
  "RIVER_SPIRITS",
  "VILLAGE_SPIRITS",
  "SHAPE_SHIFTERS",
  "HAUNTED_PLACES",
  "MYTHOLOGICAL_BEINGS",
  "POSSESSION_LEGENDS",
] as const;

export const DANGER_LEVELS = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "EXTREME",
  "UNKNOWN",
] as const;

export const SOURCE_TYPES = [
  "ORAL",
  "FAMILY",
  "LOCAL_LEGEND",
  "BOOK",
  "ONLINE",
  "OTHER",
] as const;
