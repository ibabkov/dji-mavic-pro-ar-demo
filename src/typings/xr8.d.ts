/** Camera pipeline module registered via `XR8.addCameraPipelineModule`. */
interface XR8PipelineModule {
	/** Unique identifier. */
	name: string;
	/** Called once when the camera feed begins. */
	onStart?: (args: { canvas: HTMLCanvasElement; canvasWidth: number; canvasHeight: number }) => void;
	/** Called every frame after tracking and rendering. */
	onUpdate?: (args: unknown) => void;
	/** Called when the pipeline throws an error. */
	onException?: (error: unknown) => void;
	[key: string]: unknown;
}

/** Three.js bridge: provides the scene/camera/renderer driven by XR8. */
interface XR8Threejs {
	/** Pipeline module that owns the Three.js render loop. */
	pipelineModule(): XR8PipelineModule;
	/** The Three.js objects the engine drives. Only valid after `XR8.run` has started. */
	xrScene(): {
		scene: import('three').Scene;
		camera: import('three').PerspectiveCamera;
		renderer: import('three').WebGLRenderer;
	};
}

/** SLAM world tracking controller. */
interface XR8XrController {
	/** Pipeline module that emits 6DoF pose. */
	pipelineModule(): XR8PipelineModule;
	/** Sets tracking options. Must be called before `XR8.run`. */
	configure(options: {
		/** Disable SLAM */
		disableWorldTracking?: boolean;
	}): void;
	/** Seeds the engine with the initial camera origin/orientation. */
	updateCameraProjectionMatrix(options: {
		origin?: import('three').Vector3;
		facing?: import('three').Quaternion;
	}): void;
	/** Recenters the world origin under the current camera. */
	recenter(): void;
}

/** Draws the camera feed into the WebGL canvas. */
interface XR8GlTextureRenderer {
	pipelineModule(): XR8PipelineModule;
}

/** Static configuration enums exposed by the engine. */
interface XR8XrConfig {
	/** Device-family enum used by `XR8.run({allowedDevices})`. */
	device(): {
		/** Phones, tablets, headsets, and desktop. */
		ANY: 'any';
		/** Phones and tablets only. */
		MOBILE: 'mobile';
		/** Phones, tablets, and headsets. Default. */
		MOBILE_AND_HEADSETS: 'mobile-and-headsets';
	};
}

/** Root `window.XR8` object exposed by `engine-binary` once `xr.js` has loaded. */
interface XR8 {
	/** Three.js renderer bridge. */
	Threejs: XR8Threejs;
	/** SLAM world tracking. */
	XrController: XR8XrController;
	/** Camera feed renderer. */
	GlTextureRenderer: XR8GlTextureRenderer;
	/** Engine configuration enums. */
	XrConfig: XR8XrConfig;
	/** Register a single pipeline module. */
	addCameraPipelineModule(module: XR8PipelineModule): void;
	/** Register many pipeline modules at once. */
	addCameraPipelineModules(modules: XR8PipelineModule[]): void;
	/** Detach every registered pipeline module. */
	clearCameraPipelineModules(): void;
	/** Start the camera + run loop, drawing into the given canvas. */
	run(options: {
		canvas: HTMLCanvasElement;
		/** Which device families are allowed to start a session. See `XR8.XrConfig.device()`. Defaults to `'mobile-and-headsets'`. */
		allowedDevices?: 'mobile-and-headsets' | 'mobile' | 'any';
	}): void;
	/** Stop the camera and run loop. */
	stop(): void;
}

/** Helper modules from `@8thwall/xrextras` — required for the standard XR8 lifecycle. */
interface XRExtras {
	/** Resizes the canvas to fill the viewport on every layout change. */
	FullWindowCanvas: { pipelineModule(): XR8PipelineModule };
	/** Loading screen and camera/motion permission flow. */
	Loading: { pipelineModule(): XR8PipelineModule };
	/** Renders an error screen on uncaught runtime errors. */
	RuntimeError: { pipelineModule(): XR8PipelineModule };
}

/** Pre-AR landing screen from `@8thwall/landing-page`. Detects in-app webviews and other non-AR-capable contexts and prompts the user to open the URL in a real browser. */
interface LandingPage {
	pipelineModule(): XR8PipelineModule;
}

/** Globals set by the engine bundles at runtime. */
interface Window {
	/** Set by `xr.js` once the engine boots. */
	XR8?: XR8;
	/** Set by `xrextras.js`. */
	XRExtras?: XRExtras;
	/** Set by `landing-page.js`. */
	LandingPage?: LandingPage;
	/** We expose Three.js as a global because the engine's Three.js pipeline module reads `window.THREE`. */
	THREE?: typeof import('three');
}

/**
 * Thin ESM shim that resolves once the `xr.js` script tag fires the `xrloaded` event.
 * The actual engine code is loaded via a separate `<script>`, not through this import.
 */
declare module '@8thwall/engine-binary' {
	/** Resolves to `window.XR8` once the engine is ready. */
	export const XR8Promise: Promise<XR8>;
}
