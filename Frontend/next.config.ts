import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb', // Establece el límite de tamaño del cuerpo a 10 MB
    },
  },
};

export default nextConfig;