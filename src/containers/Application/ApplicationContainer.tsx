'use client';

import React from 'react';

import dynamic from 'next/dynamic';

// @8thwall/engine-binary reads `window` at module load, so the scene tree can't be evaluated on the server.
const XR8SceneContainer = dynamic(() => import('../XR8Scene').then(m => m.XR8SceneContainer), {
	ssr: false,
});

export const ApplicationContainer = () => {
	return <XR8SceneContainer />;
};
