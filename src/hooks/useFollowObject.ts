'use client';

import { RefObject, useRef } from 'react';

import { Object3D, Vector3 } from 'three';

import { projectOnRingXZ } from '@/helpers';
import { useFrame } from '@/hooks/useFrame';

export interface IFollowObjectOptions {
	/** Orbit radius from the target on the XZ plane in meters */
	distance?: number;
	/** Per-frame lerp weight toward the ring point. */
	smoothing?: number;
	/** Hold the current XZ position while the ring point is within this distance. */
	deadband?: number;
}

/** Eases `follower` toward an XZ point in front of `target` each frame. */
export const useFollowObject = (
	followerRef: RefObject<Object3D | null>,
	target: Object3D,
	opts: IFollowObjectOptions = {},
): void => {
	const { distance = 1.5, smoothing = 0.05, deadband = 0 } = opts;
	const scratchRef = useRef(new Vector3());

	useFrame(() => {
		const follower = followerRef.current;

		if (!follower) return;

		const point = projectOnRingXZ(follower, target, distance, scratchRef.current);
		const dx = point.x - follower.position.x;
		const dz = point.z - follower.position.z;

		if (dx * dx + dz * dz < deadband * deadband) return;

		follower.position.x += dx * smoothing;
		follower.position.z += dz * smoothing;
	});
};
