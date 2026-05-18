'use client';

import React, { useEffect, useRef } from 'react';

import { XR8Promise } from '@8thwall/engine-binary';
import * as THREE from 'three';

/** Live references to the engine and the Three.js objects. */
export interface IXR8SceneContext {
	xr8: XR8;
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
}

/** Per-scene callbacks the consumer passes into `useXR8Scene`. All optional. */
export interface IUseXR8SceneOptions {
	/** Called once when the camera feed begins. */
	onStart?: (context: IXR8SceneContext) => void;
	/** Called every frame after tracking and rendering. */
	onUpdate?: (args: unknown) => void;
	/** Called when the pipeline throws an error. */
	onException?: (error: unknown) => void;
}

/**
 * Bootstraps the full XR8 session lifecycle against a canvas.
 */
export const useXR8Scene = (canvasRef: React.RefObject<HTMLCanvasElement | null>, options: IUseXR8SceneOptions = {}) => {
	const optionsRef = useRef(options);
	optionsRef.current = options;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			console.warn('[useXR8Scene] Canvas ref is not attached, aborting setup');

			return;
		}

		window.THREE = THREE;

		let activeXR8: XR8 | undefined;
		let cancelled = false;

		XR8Promise.then(xr8 => {
			if (cancelled) return;

			const globals = getXRExtrasGlobals();
			if (!globals) return;

			activeXR8 = xr8;

			xr8.XrController.configure({ disableWorldTracking: false });
			xr8.addCameraPipelineModules(
				buildPipelineModules(xr8, globals.xrExtras, globals.landingPage, createSceneModule(xr8, optionsRef)),
			);
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
		};
	}, [canvasRef]);
};

/** Reads the `XRExtras` and `LandingPage` globals set by their `<script>` tags. Logs and returns `null` if either is missing. */
function getXRExtrasGlobals(): { xrExtras: XRExtras; landingPage: LandingPage } | null {
	const xrExtras = window.XRExtras;
	const landingPage = window.LandingPage;
	if (!xrExtras || !landingPage) {
		console.error('[useXR8Scene] XRExtras or LandingPage not loaded — check <Script> tags in layout');

		return null;
	}

	return { xrExtras, landingPage };
}

/**
 * Builds the `xr8-scene` pipeline module that bridges the engine's lifecycle to the user's callbacks.
 */
function createSceneModule (xr8: XR8, optionsRef: React.RefObject<IUseXR8SceneOptions>): XR8PipelineModule {
	return ({
		name: 'xr8-scene',
		onStart: () => {
			const { scene, camera, renderer } = xr8.Threejs.xrScene();

			optionsRef.current.onStart?.({ xr8, scene, camera, renderer });

			xr8.XrController.updateCameraProjectionMatrix({
				origin: camera.position,
				facing: camera.quaternion,
			});
		},
		onUpdate: args => {
			optionsRef.current.onUpdate?.(args);
		},
		onException: error => {
			optionsRef.current.onException?.(error);
		},
	});
}

/** Returns the camera pipeline modules in the order the engine expects: camera feed => renderer => tracking => UI => scene. */
function buildPipelineModules (
	xr8: XR8,
	xrExtras: XRExtras,
	landingPage: LandingPage,
	sceneModule: XR8PipelineModule,
): XR8PipelineModule[] {
	return [
		xr8.GlTextureRenderer.pipelineModule(),
		xr8.Threejs.pipelineModule(),
		xr8.XrController.pipelineModule(),
		landingPage.pipelineModule(),
		xrExtras.FullWindowCanvas.pipelineModule(),
		xrExtras.Loading.pipelineModule(),
		xrExtras.RuntimeError.pipelineModule(),
		sceneModule,
	];
}
