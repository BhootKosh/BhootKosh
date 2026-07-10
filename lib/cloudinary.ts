import { v2 as cloudinary } from "cloudinary";

/**
 * Supports either:
 * - CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 * - or separate CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
 */
function parseCloudinaryUrl(url: string | undefined) {
  if (!url) return null;
  try {
    // cloudinary://key:secret@cloud_name
    const match = url.match(
      /^cloudinary:\/\/([^:]+):([^@]+)@([^/\s]+)/i
    );
    if (!match) return null;
    return {
      apiKey: match[1],
      apiSecret: match[2],
      cloudName: match[3],
    };
  } catch {
    return null;
  }
}

const fromUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL);

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME || fromUrl?.cloudName || "";
const apiKey = process.env.CLOUDINARY_API_KEY || fromUrl?.apiKey || "";
const apiSecret =
  process.env.CLOUDINARY_API_SECRET || fromUrl?.apiSecret || "";

export function isCloudinaryConfigured() {
  return Boolean(
    cloudName &&
      apiKey &&
      apiSecret &&
      !apiSecret.includes("*") // reject redacted placeholders
  );
}

export function getCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImageBuffer(
  buffer: Buffer,
  options?: { folder?: string; filename?: string }
) {
  const cld = getCloudinary();
  const folder =
    options?.folder || process.env.CLOUDINARY_FOLDER || "bhootkosh";

  return new Promise<{
    public_id: string;
    url: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  }>((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
        ...(options?.filename ? { public_id: options.filename } : {}),
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }
        resolve({
          public_id: result.public_id,
          url: result.url,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteCloudinaryImage(publicId: string) {
  const cld = getCloudinary();
  return cld.uploader.destroy(publicId);
}
