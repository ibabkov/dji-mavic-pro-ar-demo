'use client';

import { RefObject, useRef } from 'react';

import { AnimationMixer, Timer } from 'three';

import { useFrame } from '@/hooks/useFrame';

/** Advances the animation mixer each engine frame. */
export const useAnimationMixer = (mixerRef: RefObject<AnimationMixer | null>): void => {
	const timerRef = useRef<Timer | null>(null);

	useFrame(() => {
		const mixer = mixerRef.current;

		if (!mixer) return;

		const timer = (timerRef.current ??= new Timer());
		timer.update();
		mixer.update(timer.getDelta());
	});
};
