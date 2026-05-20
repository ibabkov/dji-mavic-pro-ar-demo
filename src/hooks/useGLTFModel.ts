'use client';

import { RefObject, useEffect, useRef, useState } from 'react';

import { AnimationMixer, Material, Mesh, Object3D, Texture, Vector3Tuple, Vector4Tuple } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { useXR8SceneContext } from '@/hooks/useXR8Scene';

const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
let dracoConfigured = false;

export type GLTFModelOptions = {
	dracoDecoderPath?: string;
	/** Initial position as [x, y, z]. */
	position?: Vector3Tuple;
	/** Initial rotation quaternion as [x, y, z, w]. */
	quaternion?: Vector4Tuple;
	/** Initial scale as [x, y, z]. */
	scale?: Vector3Tuple;
};

export type GLTFModelHandles = {
	/** Loaded model root, null until parsed. */
	ref: RefObject<Object3D | null>;
	/** Animation mixer, null until parsed or if the file has no clips. */
	mixerRef: RefObject<AnimationMixer | null>;
	/** Load error, null unless the GLB failed to load. */
	error: unknown;
};

/** Loads a GLB once, adds it to the scene, and disposes its GPU resources on unmount. */
export const useGLTFModel = (url: string, opts: GLTFModelOptions = {}): GLTFModelHandles => {
	const { scene } = useXR8SceneContext();
	const ref = useRef<Object3D | null>(null);
	const mixerRef = useRef<AnimationMixer | null>(null);
	const [error, setError] = useState<unknown>(null);
	const optsRef = useRef(opts);
	optsRef.current = opts;

	useEffect(() => {
		let loaded: Object3D | null = null;
		let cancelled = false;

		const { dracoDecoderPath, position, quaternion, scale } = optsRef.current;
		if (dracoDecoderPath && !dracoConfigured) {
			dracoLoader.setDecoderPath(dracoDecoderPath);
			dracoConfigured = true;
		}

		gltfLoader.load(
			url,
			gltf => {
				if (cancelled) return;

				loaded = gltf.scene;
				if (position) loaded.position.set(...position);
				if (quaternion) loaded.quaternion.set(...quaternion);
				if (scale) loaded.scale.set(...scale);
				scene.add(loaded);
				ref.current = loaded;

				if (gltf.animations.length > 0) {
					const mixer = new AnimationMixer(loaded);
					gltf.animations.forEach(clip => mixer.clipAction(clip).play());
					mixerRef.current = mixer;
				}
			},
			undefined,
			err => {
				if (cancelled) return;
				console.error(`[useGLTFModel] Failed to load "${url}"`, err);
				setError(err);
			},
		);

		return () => {
			cancelled = true;
			if (loaded) {
				scene.remove(loaded);
				disposeObject(loaded);
			}
			mixerRef.current?.stopAllAction();
			ref.current = null;
			mixerRef.current = null;
		};
	}, [url, scene]);

	return { ref, mixerRef, error };
};

function disposeObject(root: Object3D): void {
	root.traverse(obj => {
		const mesh = obj as Mesh;

		if (!mesh.isMesh) return;

		mesh.geometry.dispose();
		disposeMaterial(mesh.material);
	});
}

function disposeMaterial(material: Material | Material[]): void {
	const materials = Array.isArray(material) ? material : [material];
	for (const mat of materials) {
		for (const value of Object.values(mat)) {
			if (value instanceof Texture) value.dispose();
		}
		mat.dispose();
	}
}
