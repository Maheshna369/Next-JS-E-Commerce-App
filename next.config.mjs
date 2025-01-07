/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.dummyjson.com', 'dummyjson.com']
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     domains: ["cdn.dummyjson.com"],
    //     // hostname: "cdn.dummyjson.com",
    //     // pathname: "/products/images/**",
    //     // pathname: "/products/category/**",
    //   },
    // ],
    // Alternatively, use domains if the remote pattern is broad:
    // domains: ['cdn.dummyjson.com'],
  },
};

export default nextConfig;
