/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: 'image.tmdb.org',
			port: '',
			pathname: '/**',
		  },
		  {
			protocol: 'https',
			hostname: 'picsum.photos',
			port: '',
			pathname: '/**',
		  },
		  {
			protocol: 'https',
			hostname: 'm.media-amazon.com',
			port: '',
			pathname: '/**',
		  },
		],
	  },
	reactStrictMode: false,
	publicRuntimeConfig: {
		// Will be available on both server and client
		// externalSearchApiHostname: 'http://debridmediamanager.com',
		realDebridHostname: 'https://corsproxy.org/?https://api.real-debrid.com',
		allDebridHostname: 'https://api.alldebrid.com',
		allDebridAgent: 'debridMediaManager',
		bypassHostname: 'https://corsproxy.org/?',
	},
};

module.exports = nextConfig;
