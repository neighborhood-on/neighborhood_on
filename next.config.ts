import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        // @ts-expect-error
        allowedDevOrigins: ["192.168.56.1:3000"],
    },
};

export default nextConfig;
