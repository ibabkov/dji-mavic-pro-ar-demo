'use client';

import React, { useRef } from 'react';

import * as THREE from 'three';

import { SceneLayout } from '../../components/SceneLayout';
import { useXR8Scene } from '../../hooks/useXR8Scene';

export const XR8SceneContainer = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useXR8Scene(canvasRef, {
		onStart: ({ scene, camera }) => {
			console.log('[XR8SceneContainer] Scene started');

			const directional = new THREE.DirectionalLight(0xffffff, 0.8);
			directional.position.set(5, 10, 7);
			scene.add(directional);
			scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));

			const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xff3344 }));
			cube.position.set(0, 1, 0);
			scene.add(cube);

			camera.position.set(0, 2, 4);
		},
		onUpdate: () => {
			console.log('[XR8SceneContainer] Scene updated');
		},
		onException: error => {
			console.error('[XR8SceneContainer] Pipeline exception:', error);
		},
	});

	return <SceneLayout canvasRef={canvasRef} />;
};
