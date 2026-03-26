import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["@prisma/client", "prisma", "bcrypt"],
};
// next.config.js
module.exports = {
  allowedDevOrigins: ['192.168.0.2'],
}
export default nextConfig;
