import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from env
if (process.env.CLOUDINARY_URL) {
  // CLOUDINARY_URL format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
  // cloudinary.config() auto-parses CLOUDINARY_URL from env
} else {
  console.warn("[Cloudinary] CLOUDINARY_URL not configured");
}

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

// Upload an image buffer/base64 to Cloudinary
export async function uploadImage(
  file: Buffer | string, // Buffer or base64 string
  options: {
    folder?: string;
    transformation?: string;
    publicId?: string;
  } = {}
): Promise<UploadResult | null> {
  if (!process.env.CLOUDINARY_URL) return null;

  try {
    const result = await cloudinary.uploader.upload(
      typeof file === "string"
        ? file
        : `data:image/png;base64,${file.toString("base64")}`,
      {
        folder: options.folder || "freelancehigh",
        public_id: options.publicId,
        transformation: options.transformation,
        overwrite: true,
        resource_type: "image",
      }
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error("[Cloudinary] Upload error:", error);
    return null;
  }
}

// Delete an image from Cloudinary
export async function deleteImage(publicId: string): Promise<boolean> {
  if (!process.env.CLOUDINARY_URL) return false;
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("[Cloudinary] Delete error:", error);
    return false;
  }
}

// Generate optimized URL for avatars
export function avatarUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: 200,
        height: 200,
        crop: "fill",
        gravity: "face",
        quality: "auto",
        format: "auto",
      },
    ],
  });
}

// Generate optimized URL for service images
export function serviceImageUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: 800,
        height: 600,
        crop: "fill",
        quality: "auto",
        format: "auto",
      },
    ],
  });
}
