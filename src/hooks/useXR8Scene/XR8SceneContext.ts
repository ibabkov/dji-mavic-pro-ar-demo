'use client';

import { createContext } from 'react';

import { XR8SceneHandles } from '@/types';

/** Promise of the scene handles, unwrapped by consumers with `use()`. Null when no provider is mounted. */
export const XR8SceneContext = createContext<Promise<XR8SceneHandles> | null>(null);
