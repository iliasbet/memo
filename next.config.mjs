import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN || '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
                ]
            }
        ]
    }
};

const withPWAConfig = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development'
});

export default withPWAConfig(nextConfig); 