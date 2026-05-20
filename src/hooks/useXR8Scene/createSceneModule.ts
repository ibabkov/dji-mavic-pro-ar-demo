import React from 'react';

import { FrameCallback, XR8SceneHandles } from '@/types';

import { UseXR8SceneOptions } from './useXR8Scene';

/** Builds the scene pipeline module. Forwards lifecycle events to the caller's callbacks and the frame bus, and resolves `onReady` on start. */
export const createSceneModule = (
	xr8: XR8,
	frameBus: Set<FrameCallback>,
	onReady: (ctx: XR8SceneHandles) => void,
	optionsRef: React.RefObject<UseXR8SceneOptions>,
): XR8PipelineModule => ({
	name: 'xr8-scene',
	onStart: () => {
		const { scene, camera, renderer } = xr8.Threejs.xrScene();
		const ctx: XR8SceneHandles = { xr8, scene, camera, renderer, frameBus };

		optionsRef.current.onStart?.(ctx);

		xr8.XrController.updateCameraProjectionMatrix({
			origin: camera.position,
			facing: camera.quaternion,
		});

		onReady(ctx);
	},
	onUpdate: args => {
		optionsRef.current.onUpdate?.(args);
		frameBus.forEach(callback => callback(args));
	},
	onException: error => {
		optionsRef.current.onException?.(error);
	},
});
