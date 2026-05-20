'use client';

import dynamic from 'next/dynamic';

// @8thwall/engine-binary reads window, so the scene tree can't render on the server.
export const DroneSceneContainer = dynamic(() => import('./DroneSceneContainer').then(m => m.DroneSceneContainer), {
	ssr: false,
});
