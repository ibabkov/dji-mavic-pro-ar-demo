'use client';

import React from 'react';

import { useSetupScene } from '@/hooks/useSetupScene';
import { useXR8SceneContext } from '@/hooks/useXR8Scene';

import { DroneContainer } from '../Drone';

export const SceneContentContainer = (): React.ReactNode => {
	const ctx = useXR8SceneContext();
	useSetupScene(ctx);

	return <DroneContainer />;
};
