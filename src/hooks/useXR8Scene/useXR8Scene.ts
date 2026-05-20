'use client';

import React, { useEffect, useRef } from 'react';

import { IFrameCallback, IXR8SceneContext } from '@/types';

import { buildXR8 } from './buildXR8';
import { buildPipelineModules, getXRExtrasGlobals } from './buildPipelineModules';
import { createSceneModule } from './createSceneModule';

/** Lifecycle callbacks the caller wires into a scene. */
export interface IUseXR8SceneOptions {
	/** Called once when the engine starts, with the scene handles. */
	onStart?: (context: IXR8SceneContext) => void;
	/** Called every frame with the engine's frame args. */
	onUpdate?: (args: XR8FrameArgs) => void;
	/** Called when a pipeline module throws. */
	onException?: (error: unknown) => void;
}

/** A promise paired with its resolve function. */
interface IDeferred<T> {
	/** Promise resolved by `resolve`. */
	promise: Promise<T>;
	/** Resolves `promise` with a value. */
	resolve: (value: T) => void;
}

/** Creates a promise with its resolver exposed. */
const createDeferred = <T>(): IDeferred<T> => {
	let resolve!: (value: T) => void;
	const promise = new Promise<T>(r => {
		resolve = r;
	});

	return { promise, resolve };
};

/** Boots the XR8 session against `canvasRef` and returns a promise of the scene handles that resolves on engine start. */
export const useXR8Scene = (
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	options: IUseXR8SceneOptions = {},
): Promise<IXR8SceneContext> => {
	const optionsRef = useRef(options);
	optionsRef.current = options;

	const deferredRef = useRef<IDeferred<IXR8SceneContext> | null>(null);
	deferredRef.current ??= createDeferred<IXR8SceneContext>();
	const { promise, resolve } = deferredRef.current;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			console.warn('[useXR8Scene] Canvas ref is not attached, aborting setup');

			return;
		}

		const frameBus = new Set<IFrameCallback>();

		const teardown = buildXR8({
			canvas,
			buildModules: xr8 => {
				const globals = getXRExtrasGlobals();
				if (!globals) return [];

				return buildPipelineModules(
					xr8,
					globals.xrExtras,
					globals.landingPage,
					createSceneModule(xr8, frameBus, resolve, optionsRef),
				);
			},
		});

		return () => {
			teardown();
			frameBus.clear();
		};
	}, [canvasRef, resolve]);

	return promise;
};
