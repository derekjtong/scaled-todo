/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_TODO_API_URL: process.env.NEXT_PUBLIC_TODO_API_URL,
  },
  output: "standalone",
};

export default nextConfig;
