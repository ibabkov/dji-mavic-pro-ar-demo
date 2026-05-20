'use client';

import { use, useContext } from 'react';

import { XR8SceneHandles } from '@/types';

import { XR8SceneContext } from './XR8SceneContext';

/** Reads the scene from context, suspending until the engine starts. Throws if used outside the provider. */
export const useXR8SceneContext = (): XR8SceneHandles => {
	const scenePromise = useContext(XR8SceneContext);
	if (!scenePromise) throw new Error('useXR8SceneContext must be used inside <XR8SceneContext.Provider>');

	return use(scenePromise);
};
