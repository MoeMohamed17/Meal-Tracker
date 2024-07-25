/** @type {import('next').NextConfig} */
const nextConfig = {
    // This ensures that all our internal requests are forwarded to the Express REST API through the middleware
    async rewrites() {
        return [
            {
            source: '/:path*',
            destination: 'http://localhost:65532/:path*',
            },
        ];
    },
};

export default nextConfig;
