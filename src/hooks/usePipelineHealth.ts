'use client';

import { useCallback, useRef, useState } from 'react';

export type PipelineHealth = {
	/** True once `limit` consecutive frame exceptions have occurred. */
	hasFailed: boolean;
	/** Call on a clean frame, resets the consecutive exception count. */
	reportFrame: () => void;
	/** Call when a frame throws, increments the count and trips `hasFailed` at `limit`. */
	reportException: (error: unknown) => void;
};

/** Tracks AR session health by counting consecutive frame exceptions, tripping `hasFailed` once `limit` is reached. */
export const usePipelineHealth = (limit: number = 10): PipelineHealth => {
	const exceptionCountRef = useRef(0);
	const [hasFailed, setHasFailed] = useState(false);

	const reportFrame = useCallback(() => {
		exceptionCountRef.current = 0;
	}, []);

	const reportException = useCallback(
		(error: unknown) => {
			console.error('[usePipelineHealth] Pipeline exception:', error);
			exceptionCountRef.current += 1;
			if (exceptionCountRef.current >= limit) setHasFailed(true);
		},
		[limit],
	);

	return { hasFailed, reportFrame, reportException };
};
