import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

/** Per-frame callback */
export type FrameCallback = (args: XR8FrameArgs) => void;

export type XR8SceneHandles = {
	/** Running XR8 engine instance. */
	xr8: XR8;
	/** Three.js scene the engine renders. */
	scene: Scene;
	/** Camera driven by the engine's tracking. */
	camera: PerspectiveCamera;
	/** WebGL renderer. */
	renderer: WebGLRenderer;
	/** Callbacks run on every engine frame. */
	frameBus: Set<FrameCallback>;
};
