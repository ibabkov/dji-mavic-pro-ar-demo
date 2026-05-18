import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import CopyWebpackPlugin from 'copy-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const localIPv4 = getLocalIPv4();

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Development-only, allows the dev server to accept requests from mobile devices on the same LAN.
	allowedDevOrigins: localIPv4 ? [localIPv4] : [],
	webpack: (config, { isServer }) => {
		config.module.rules.push({
			test: /\.(glsl|vs|fs|vert|frag)$/,
			exclude: /node_modules/,
			use: ['raw-loader', 'glslify-loader'],
		});

		if (!isServer) {
			// The 8thWall bundles (xr.js, xrextras.js, landing-page.js) self-bootstrap via <script> tags and
			// fetch sibling chunks (xr-slam.js, resources/*) relative to their own URL — they can't be passed
			// through webpack. Copy the prebuilt dists into /public so they're served as static assets.
			config.plugins.push(
				new CopyWebpackPlugin({
					patterns: [
						{
							from: path.resolve(__dirname, 'node_modules/@8thwall/engine-binary/dist'),
							to: path.resolve(__dirname, 'public/external/xr'),
							globOptions: { ignore: ['**/LICENSE'] },
						},
						{
							from: path.resolve(__dirname, 'node_modules/@8thwall/xrextras/dist'),
							to: path.resolve(__dirname, 'public/external/xrextras'),
							globOptions: { ignore: ['**/LICENSE'] },
						},
						{
							from: path.resolve(__dirname, 'node_modules/@8thwall/landing-page/dist'),
							to: path.resolve(__dirname, 'public/external/landing-page'),
							globOptions: { ignore: ['**/LICENSE'] },
						},
					],
				}),
			);
		}

		return config;
	},
};

/** Return first non-internal IPv4 address on this machine, or `undefined` if no LAN interface is up. */
function getLocalIPv4 () {
	for (const ifaces of Object.values(os.networkInterfaces())) {
		for (const iface of ifaces ?? []) {
			if (iface.family === 'IPv4' && !iface.internal) return iface.address;
		}
	}

	return undefined;
}


export default nextConfig;
