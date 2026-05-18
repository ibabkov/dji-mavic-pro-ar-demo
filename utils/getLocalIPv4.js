import os from 'node:os';

/** Return first non-internal IPv4 address on this machine, or `undefined` if no LAN interface is up. */
export const getLocalIPv4 = () => {
	for (const ifaces of Object.values(os.networkInterfaces())) {
		for (const iface of ifaces ?? []) {
			if (iface.family === 'IPv4' && !iface.internal) return iface.address;
		}
	}

	return undefined;
};
