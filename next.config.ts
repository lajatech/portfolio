import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // There is a stray package-lock.json in the home directory above this
    // project, and Turbopack otherwise infers that as the workspace root. It
    // then resolves modules and traces files from the wrong place, which works
    // locally by luck and breaks in CI. Pin the root to this project.
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
