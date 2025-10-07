/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ftp.goit.study",
        pathname: "/img/campers-test-task/**",
      },
    ],
  },
};

export default nextConfig;