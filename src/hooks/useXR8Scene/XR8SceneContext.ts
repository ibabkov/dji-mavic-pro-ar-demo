'use client';

import { createContext } from 'react';

import { IXR8SceneContext } from '@/types';

/** Promise of the scene handles, unwrapped by consumers with `use()`. Null when no provider is mounted. */
export const XR8SceneContext = createContext<Promise<IXR8SceneContext> | null>(null);
