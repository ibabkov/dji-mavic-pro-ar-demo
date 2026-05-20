import { Object3D, Vector3 } from 'three';

/** Projects `follower` object onto the XZ ring of radius `distance`(meters) around `target`, keeping its current Y. */
export const projectOnRingXZ = (follower: Object3D, target: Object3D, distance: number, out: Vector3): Vector3 => {
	const dx = follower.position.x - target.position.x;
	const dz = follower.position.z - target.position.z;
	const len = Math.hypot(dx, dz) || 1;

	return out.set(
		target.position.x + (dx / len) * distance,
		follower.position.y,
		target.position.z + (dz / len) * distance,
	);
};
