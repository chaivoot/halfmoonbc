import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75],
    formats: ["image/avif", "image/webp"],
    // Photos uploaded from /admin live in a public Vercel Blob store.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  async redirects() {
    // Send the old Vercel address to the real domain. Preview deployments use
    // other hostnames, so they are unaffected.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "halfmoonbc.vercel.app" }],
        destination: "https://halfmoonbordercollie.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
