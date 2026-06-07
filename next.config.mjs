/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
serverComponentsExternalPackages: ['@better-auth/kysely-adapter'],
},


};

export default nextConfig;
