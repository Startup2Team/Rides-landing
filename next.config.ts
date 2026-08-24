import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // No `output: "standalone"` — that's Docker-image mode. Deploying via
  // @opennextjs/cloudflare (see wrangler.jsonc / open-next.config.ts), which
  // builds straight from the default `.next` output.

  // Two lockfiles (yarn.lock + package-lock.json) live here, which can make
  // Turbopack infer the wrong workspace root. Pin it for deterministic builds.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
