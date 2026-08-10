import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dofusdb.fr",
        pathname: "/img/monsters/**",
      },
    ],
    qualities: [75],
  },
}

export default nextConfig
