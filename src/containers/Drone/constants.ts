import { Vector3Tuple, Vector4Tuple } from 'three';

import { ITiltOnMoveOptions } from '@/helpers';
import { IFollowAltitudeOptions } from '@/hooks/useFollowAltitude';
import { IFollowObjectOptions } from '@/hooks/useFollowObject';

export interface IDroneConfig {
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
	follow: IFollowObjectOptions;
	/** Altitude-tracking config. */
	altitude: IFollowAltitudeOptions;
	/** Tilt-on-move config. */
	tilt: ITiltOnMoveOptions;
}

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
	tilt: { factor: 5, smoothing: 0.1 },
} satisfies IDroneConfig;
