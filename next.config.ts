import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  /**
   * Next blocks cross-origin requests to dev-only assets (`/_next/hmr`,
   * `/_next/static/chunks/...`) by default, which breaks hot reload whenever
   * the dev server is reached through anything other than the hostname it was
   * started on — a container port mapping, a LAN IP, or a local proxy. Allow
   * the loopback origins. Development only; no effect on a production build.
   */
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
