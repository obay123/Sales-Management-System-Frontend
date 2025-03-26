/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://sales-management-system-backend-2.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
