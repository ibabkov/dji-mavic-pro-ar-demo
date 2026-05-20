'use client';

import React, { useState } from 'react';

import styles from './BottomOverlay.module.css';

export type BottomOverlayProps = {
	/** Hints shown one at a time, looping back to the first after the last. */
	hints?: string[];
	/** Seconds each hint stays before the next one shows */
	durationSeconds?: number;
};

const DEFAULT_HINTS = ['Find a well-lit area', 'Hold your phone vertically', 'Look for the drone', 'Walk around - the drone will follow'];

export const BottomOverlay = (props: BottomOverlayProps) => {
	const { hints = DEFAULT_HINTS, durationSeconds = 5 } = props;
	const [cycle, setCycle] = useState(0);

	if (hints.length === 0) return null;

	return (
		<div className={styles.overlay} style={{ '--bottom-overlay-duration': `${durationSeconds}s` } as React.CSSProperties}>
			<span key={cycle} className={styles.item} onAnimationEnd={() => setCycle(prev => prev + 1)}>
				{hints[cycle % hints.length]}
			</span>
		</div>
	);
};
