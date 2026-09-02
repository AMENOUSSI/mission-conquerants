import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    // Match MAX_UPLOAD_BYTES in src/lib/blob.ts (100MB, video-friendly) --
    // the media upload Server Action ships the raw file in its body.
    serverActions: {
      bodySizeLimit: "105mb",
    },
  },
};

export default nextConfig;
