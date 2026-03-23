/**
 * Cloudinary URL utilities — safe for client-side use (no Node.js deps).
 * For upload/delete operations, use lib/cloudinary.ts (server-only).
 */

/**
 * Add Cloudinary transforms to an existing URL.
 * Works with full Cloudinary URLs (res.cloudinary.com).
 * Falls back to original URL for non-Cloudinary URLs.
 */
export function optimizedUrl(url: string, width: number = 800): string {
  if (!url) return url;
  // Only transform Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return url;
  // Already has transforms (contains /upload/... with transforms)
  const uploadSegment = "/upload/";
  const idx = url.indexOf(uploadSegment);
  if (idx === -1) return url;
  // Insert transforms after /upload/
  const before = url.substring(0, idx + uploadSegment.length);
  const after = url.substring(idx + uploadSegment.length);
  // Skip if transforms already present (starts with a transform like c_, w_, f_, q_)
  if (/^[a-z]_/.test(after)) return url;
  return `${before}c_limit,w_${width},q_auto,f_auto/${after}`;
}
