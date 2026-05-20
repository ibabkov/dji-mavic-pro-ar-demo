/** Per-frame data the engine passes to every pipeline module's `onUpdate` (and, in this app, to `useFrame` subscribers). */
interface XR8FrameArgs {
	/** Engine framework handle. */
	framework: unknown;
	/** GPU/texture state captured at the start of the frame. */
	frameStartResult: {
		/** Texture holding the current camera frame. */
		cameraTexture: WebGLTexture;
		/** Texture used for CPU/GPU compute passes. */
		computeTexture: WebGLTexture;
		/** Active WebGL rendering context. */
		GLctx: WebGLRenderingContext;
		/** Camera texture width in pixels. */
		textureWidth: number;
		/** Camera texture height in pixels. */
		textureHeight: number;
		/** Device orientation in degrees. */
		orientation: number;
		/** Frame timestamp in milliseconds. Difference across frames for delta time. */
		videoTime: number;
		/** Whether the frame needs a repaint. */
		repaint: boolean;
	};
	/** CPU-side tracking results for the frame. */
	processCpuResult: {
		/** Camera pose and intrinsics, absent until tracking is established. */
		reality?: {
			/** Camera rotation quaternion. */
			rotation: { w: number; x: number; y: number; z: number };
			/** Camera position in world space. */
			position: { x: number; y: number; z: number };
			/** Camera intrinsics matrix as a flat array. */
			intrinsics: number[];
			/** Current tracking quality. */
			trackingStatus?: 'NORMAL' | 'LIMITED' | 'NOT_AVAILABLE';
			/** Reason for a degraded tracking status. */
			trackingReason?: string;
		};
	};
	/** GPU-side processing results for the frame. */
	processGpuResult: unknown;
}

/** Camera pipeline module registered via `XR8.addCameraPipelineModule`. */
interface XR8PipelineModule {
	/** Unique identifier. */
	name: string;
	/** Called once when the camera feed begins. */
	onStart?: (args: { canvas: HTMLCanvasElement; canvasWidth: number; canvasHeight: number }) => void;
	/** Called every frame after tracking and rendering. */
	onUpdate?: (args: XR8FrameArgs) => void;
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
	/** Pipeline module that renders the camera texture. */
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
	/** Starts the camera and run loop, drawing into the given canvas. */
	run(options: {
		/** Canvas the engine renders into. */
		canvas: HTMLCanvasElement;
		/** Which device families may start a session. See `XR8.XrConfig.device()`. Defaults to `'mobile-and-headsets'`. */
		allowedDevices?: 'mobile-and-headsets' | 'mobile' | 'any';
	}): void;
	/** Stop the camera and run loop. */
	stop(): void;
}

/** Helper modules from `@8thwall/xrextras`. Required for the standard XR8 lifecycle. */
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
	/** Pipeline module that renders the pre-AR landing screen. */
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
