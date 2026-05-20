'use client';

import React from 'react';

import { DRONE_CONFIG } from '@/containers/Drone/constants';
import { useAnimationMixer } from '@/hooks/useAnimationMixer';
import { useDroneOrientation } from '@/hooks/useDroneOrientation';
import { useFollowAltitude } from '@/hooks/useFollowAltitude';
import { useFollowObject } from '@/hooks/useFollowObject';
import { useGLTFModel } from '@/hooks/useGLTFModel';
import { useXR8SceneContext } from '@/hooks/useXR8Scene';

export const DroneContainer = (): React.ReactNode => {
	const { ref: droneRef, mixerRef } = useGLTFModel(DRONE_CONFIG.asset.modelUrl, {
		dracoDecoderPath: DRONE_CONFIG.asset.dracoDecoderPath,
		...DRONE_CONFIG.transform,
	});
	const { camera } = useXR8SceneContext();

	useAnimationMixer(mixerRef);
	useFollowObject(droneRef, camera, DRONE_CONFIG.follow);
	useFollowAltitude(droneRef, camera, DRONE_CONFIG.altitude);
	useDroneOrientation(droneRef, camera, DRONE_CONFIG.tilt);

	return null;
};
