import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb', // Establece el límite de tamaño del cuerpo a 10 MB
    },
  },
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "7252", // Asegúrate de que el puerto sea el correcto
      },
    ],
  },
};

export default nextConfig;