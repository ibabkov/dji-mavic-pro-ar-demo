import React from 'react';

import styles from './SceneLayout.module.css';

export type SceneLayoutProps = {
	canvasRef: React.Ref<HTMLCanvasElement>;
};

export const SceneLayout = (props: SceneLayoutProps) => {
	const { canvasRef } = props;

	return <canvas ref={canvasRef} className={styles.canvas} />;
};
