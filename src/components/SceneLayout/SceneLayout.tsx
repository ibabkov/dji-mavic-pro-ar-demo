import React from 'react';

import styles from './SceneLayout.module.css';

export interface ISceneLayoutProps {
	canvasRef: React.Ref<HTMLCanvasElement>;
}

export const SceneLayout = (props: ISceneLayoutProps) => {
	const { canvasRef } = props;

	return <canvas ref={canvasRef} className={styles.canvas} />;
};
