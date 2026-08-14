import { sanityImg } from "@/lib/utils";

/**
 * Custom `next/image` loader for assets served by the Sanity CDN.
 *
 * The Sanity CDN already resizes and auto-negotiates WebP/AVIF, so routing
 * these images through the Vercel Image Optimization API would pay for a
 * transformation that has already been done upstream — for free. With this
 * loader, Next still builds a responsive `srcset`, but every entry points
 * straight at `cdn.sanity.io`.
 *
 * Pass the raw `asset->url` as `src`; the transform params are added here.
 */
export default function sanityLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Drop any params already on the URL so they can't fight the ones we add.
  const [base] = src.split("?");
  return sanityImg(base, width, quality ?? 75);
}
