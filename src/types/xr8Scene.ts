import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

/** Per-frame callback */
export type IFrameCallback = (args: XR8FrameArgs) => void;

export interface IXR8SceneContext {
	/** Running XR8 engine instance. */
	xr8: XR8;
	/** Three.js scene the engine renders. */
	scene: Scene;
	/** Camera driven by the engine's tracking. */
	camera: PerspectiveCamera;
	/** WebGL renderer. */
	renderer: WebGLRenderer;
	/** Callbacks run on every engine frame. */
	frameBus: Set<IFrameCallback>;
}
