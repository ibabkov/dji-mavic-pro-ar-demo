'use client';

import { Suspense, useRef } from 'react';

import { SceneLayout } from '@/components/SceneLayout';
import { StatusPage } from '@/components/StatusPage';
import { usePipelineHealth } from '@/hooks/usePipelineHealth';
import { useXR8Scene, XR8SceneContext } from '@/hooks/useXR8Scene';

import { SceneContentContainer } from '../SceneContent';

export const DroneSceneContainer = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { hasFailed, reportFrame, reportException } = usePipelineHealth();

	const scenePromise = useXR8Scene(canvasRef, {
		onStart: ctx => {
			ctx.camera.position.set(0, 1.8, 2);
		},
		onUpdate: ()=> reportFrame(),
		onException: (error)=> reportException(error),
	});

	if (hasFailed) {
		return <StatusPage title="AR error" description="The camera session stopped responding. Reload the page to try again." />;
	}

	return (
		<>
			<SceneLayout canvasRef={canvasRef} />
			<XR8SceneContext.Provider value={scenePromise}>
				<Suspense fallback={null}>
					<SceneContentContainer />
				</Suspense>
			</XR8SceneContext.Provider>
		</>
	);
};
