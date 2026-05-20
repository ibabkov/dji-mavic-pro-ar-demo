import { MathUtils, Object3D, Vector3 } from 'three';

export type TiltOnMoveOptions = {
	/** Scales horizontal speed into a target lean angle. */
	factor?: number;
	/** Per-frame lerp weight toward the target tilt. */
	smoothing?: number;
	/** Maximum lean in degrees. */
	maxTiltDeg?: number;
};

/** Leans `object` into its own horizontal motion */
export const tiltOnMove = (object: Object3D, prevPosition: Vector3, opts: TiltOnMoveOptions = {}): void => {
	const { factor = 5, smoothing = 0.1, maxTiltDeg = 45 } = opts;
	const maxRad = MathUtils.degToRad(maxTiltDeg);

	const dx = object.position.x - prevPosition.x;
	const dz = object.position.z - prevPosition.z;

	// Decompose horizontal motion into drone-local forward/right axes
	const yaw = object.rotation.y;
	const cosY = Math.cos(yaw);
	const sinY = Math.sin(yaw);
	const forwardSpeed = -cosY * dx + sinY * dz;
	const rightSpeed = -sinY * dx - cosY * dz;

	const targetPitch = MathUtils.clamp(forwardSpeed * factor, -maxRad, maxRad);
	const targetRoll = MathUtils.clamp(-rightSpeed * factor, -maxRad, maxRad);

	// Smoothing toward the target tilt to reduce jitter and ease starts and stops.
	object.rotation.z += (targetPitch - object.rotation.z) * smoothing;
	object.rotation.x += (targetRoll - object.rotation.x) * smoothing;

	prevPosition.copy(object.position);
};
