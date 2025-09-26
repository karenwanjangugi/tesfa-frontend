import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        new URL('https://tesfa-53b1c4b2cf65.herokuapp.com/**'),
      ],
    },
  };

export default nextConfig;
