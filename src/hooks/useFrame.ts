'use client';

import { useEffect, useRef } from 'react';

import { useXR8SceneContext } from '@/hooks/useXR8Scene';
import { IFrameCallback } from '@/types';

export type { IFrameCallback };

/** Subscribes a callback to the scene's frame bus for the component's lifetime. */
export const useFrame = (callback: IFrameCallback): void => {
	const { frameBus } = useXR8SceneContext();
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	useEffect(() => {
		const dispatch: IFrameCallback = args => callbackRef.current(args);
		frameBus.add(dispatch);

		return () => {
			frameBus.delete(dispatch);
		};
	}, [frameBus]);
};
