/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hqfeugrebpumkukervqz.supabase.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**',
      }
    ],
  },
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
