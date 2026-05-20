import { Object3D } from 'three';

/** Yaws `object` around Y so its -X forward axis points at `target` horizontally. */
export const lookAtObject = (object: Object3D, target: Object3D): void => {
	const dx = target.position.x - object.position.x;
	const dz = target.position.z - object.position.z;

	object.rotation.y = Math.atan2(dz, -dx);
};
