import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // jsdom (pulled in by isomorphic-dompurify) ships a transitive dependency
  // with broken CJS/ESM interop when bundled by Turbopack on Vercel's Linux
  // runtime. Excluding it from the server bundle makes Node require() it
  // natively from node_modules at runtime instead, which works correctly.
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
