import { z } from "zod";
import {
  DANGER_LEVELS,
  GHOST_TYPES,
  SOURCE_TYPES,
} from "./utils";

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const submissionSchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  regionText: z.string().min(2, "Region/state is required").max(120),
  story: z.string().min(50, "Please share more of the legend (min 50 chars)").max(10000),
  sourceType: z.enum(SOURCE_TYPES),
  contactEmail: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
});

const statusEnum = z.enum(["DRAFT", "PUBLISHED"]);
const dangerEnum = z.enum(DANGER_LEVELS);
const typeEnum = z.enum(GHOST_TYPES);

export const ghostSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  otherNames: z.array(z.string()).default([]),
  type: typeEnum,
  regionId: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  dangerLevel: dangerEnum.default("UNKNOWN"),
  habitat: z.string().optional().nullable(),
  appearance: z.string().optional().nullable(),
  behavior: z.string().optional().nullable(),
  origin: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  culturalNotes: z.string().optional().nullable(),
  sources: z.string().optional().nullable(),
  image: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  gallery: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
  relatedGhostIds: z.array(z.string()).default([]),
  status: statusEnum.default("DRAFT"),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export const hauntedPlaceSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  location: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  history: z.string().optional().nullable(),
  legend: z.string().optional().nullable(),
  reportedActivity: z.string().optional().nullable(),
  warning: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
  relatedGhostIds: z.array(z.string()).default([]),
  status: statusEnum.default("DRAFT"),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export const storySchema = z.object({
  title: z.string().min(1).max(250),
  slug: z.string().min(1).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  regionId: z.string().optional().nullable(),
  coverImage: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  tagIds: z.array(z.string()).default([]),
  relatedGhostIds: z.array(z.string()).default([]),
  status: statusEnum.default("DRAFT"),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export const regionSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().optional().nullable(),
  image: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  state: z.string().optional().nullable(),
});

export const tagSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type GhostInput = z.infer<typeof ghostSchema>;
export type HauntedPlaceInput = z.infer<typeof hauntedPlaceSchema>;
export type StoryInput = z.infer<typeof storySchema>;
export type RegionInput = z.infer<typeof regionSchema>;
export type TagInput = z.infer<typeof tagSchema>;
