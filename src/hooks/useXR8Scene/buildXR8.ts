import { XR8Promise } from '@8thwall/engine-binary';
import * as THREE from 'three';

/** Options for buildXR8. */
export interface IBuildXR8Options {
	/** Canvas the engine renders into. */
	canvas: HTMLCanvasElement;
	/** Builds the pipeline modules once the engine is ready. */
	buildModules: (xr8: XR8) => XR8PipelineModule[];
}

/** Boots an XR8 session against a canvas. Returns a teardown that stops the engine and restores `window.THREE`. */
export const buildXR8 = ({ canvas, buildModules }: IBuildXR8Options): (() => void) => {
	// The engine reads window.THREE. Snapshot the prior value so teardown can restore it.
	const previousTHREE = window.THREE;
	window.THREE = THREE;

	let activeXR8: XR8 | undefined;
	let cancelled = false;

	XR8Promise.then(xr8 => {
		if (cancelled) return;

		const modules = buildModules(xr8);
		if (modules.length === 0) return;

		activeXR8 = xr8;
		xr8.XrController.configure({ disableWorldTracking: false });
		xr8.addCameraPipelineModules(modules);

		const devices = xr8.XrConfig.device();
		const allowedDevices = process.env.NODE_ENV === 'development' ? devices.ANY : devices.MOBILE_AND_HEADSETS;
		xr8.run({ canvas, allowedDevices });
	});

	return () => {
		cancelled = true;
		if (activeXR8) {
			activeXR8.stop();
			activeXR8.clearCameraPipelineModules();
		}
		window.THREE = previousTHREE;
	};
};
