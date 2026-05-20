'use client';

import { RefObject } from 'react';

import { Object3D } from 'three';

import { useFrame } from '@/hooks/useFrame';

export type FollowAltitudeOptions = {
	/** Vertical offset from the target's Y. */
	offset?: number;
	/** Per-frame lerp weight toward the target altitude. */
	smoothing?: number;
	/** Hold the current Y while the target is within this distance, */
	deadband?: number;
	minY?: number;
	maxY?: number;
};

/** Lerps `follower.y` toward `target.y + offset` each frame, holding still inside a deadband to reject jitter. */
export const useFollowAltitude = (followerRef: RefObject<Object3D | null>, target: Object3D, opts: FollowAltitudeOptions = {}): void => {
	const { offset = 0, smoothing = 0.1, deadband = 0, minY, maxY } = opts;

	useFrame(() => {
		const follower = followerRef.current;

		if (!follower) return;

		let desired = target.position.y + offset;
		if (minY !== undefined) desired = Math.max(minY, desired);
		if (maxY !== undefined) desired = Math.min(maxY, desired);

		const gap = desired - follower.position.y;

		if (Math.abs(gap) < deadband) return;

		follower.position.y += gap * smoothing;
	});
};
