import { Vector3Tuple, Vector4Tuple } from 'three';

import { TiltOnMoveOptions } from '@/helpers';
import { FollowAltitudeOptions } from '@/hooks/useFollowAltitude';
import { FollowObjectOptions } from '@/hooks/useFollowObject';

export type DroneConfig = {
	/** GLB model and Draco decoder paths. */
	asset: {
		/** Path to the GLB model. */
		modelUrl: string;
		/** Path the Draco decoder files are served from. */
		dracoDecoderPath: string;
	};
	/** Initial transforms applied to the loaded model. */
	transform: {
		/** Initial position as [x, y, z]. */
		position: Vector3Tuple;
		/** Initial rotation quaternion as [x, y, z, w]. */
		quaternion: Vector4Tuple;
		/** Initial scale as [x, y, z]. */
		scale: Vector3Tuple;
	};
	/** Follow-flight config. */
	follow: FollowObjectOptions;
	/** Altitude-tracking config. */
	altitude: FollowAltitudeOptions;
	/** Tilt-on-move config. */
	tilt: TiltOnMoveOptions;
};

export const DRONE_CONFIG = {
	asset: {
		modelUrl: '/drone.glb',
		dracoDecoderPath: '/external/draco/',
	},
	transform: {
		position: [0, 1.3, 0],
		quaternion: [0, 0.707, 0, 0.707],
		scale: [0.015, 0.015, 0.015],
	},
	follow: {
		distance: 1.5,
		smoothing: 0.03,
		deadband: 0.05,
	},
	altitude: { offset: -0.5, smoothing: 0.02, deadband: 0.05 },
	tilt: { factor: 10, smoothing: 0.1, maxTiltDeg: 30 },
} satisfies DroneConfig;
