'use client';

import { RefObject, useRef } from 'react';

import { Object3D, Vector3 } from 'three';

import { TiltOnMoveOptions, lookAtObject, tiltOnMove } from '@/helpers';
import { useFrame } from '@/hooks/useFrame';

/** Orients the drone each frame: yaw toward `target`, then tilt into motion using that same-frame yaw. */
export const useDroneOrientation = (droneRef: RefObject<Object3D | null>, target: Object3D, tiltOpts: TiltOnMoveOptions = {}): void => {
	const prevPosRef = useRef<Vector3 | null>(null);

	useFrame(() => {
		const drone = droneRef.current;

		if (!drone) return;

		lookAtObject(drone, target);

		if (!prevPosRef.current) prevPosRef.current = drone.position.clone();
		tiltOnMove(drone, prevPosRef.current, tiltOpts);
	});
};
