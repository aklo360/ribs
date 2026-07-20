import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      "www.rootsinbluestone.com",
      "ribs.music",
      "www.ribs.music",
    ].map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://rootsinbluestone.com/:path*",
      permanent: true,
    }));
  },
};

export default nextConfig;
