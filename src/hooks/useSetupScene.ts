'use client';

import { useEffect } from 'react';

import { AmbientLight, DirectionalLight } from 'three';

import { IXR8SceneContext } from '@/types';

export const useSetupScene = (ctx: IXR8SceneContext): void => {
	useEffect(() => {
		const { scene } = ctx;
		const keyLight = new DirectionalLight(0xffffff, 3);
		keyLight.position.set(5, 10, 7);
		const fillLight = new DirectionalLight(0xffffff, 3);
		fillLight.position.set(-5, 10, -7);
		const ambient = new AmbientLight(0xffffff, 3);

		scene.add(keyLight, fillLight, ambient);

		return () => {
			scene.remove(keyLight, fillLight, ambient);
		};
	}, [ctx]);
};
