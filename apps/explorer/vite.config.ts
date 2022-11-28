// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

import tsconfig from './tsconfig.json';

const alias = (folder: string) => new URL(folder, import.meta.url).pathname;

const tsconfigPaths = {};
Object.entries(tsconfig.compilerOptions.paths).forEach(([key, [value]]) => {
    tsconfigPaths[key] = alias(value);
});

// Assign the Vercel Analytics ID into a vite-safe name:
process.env.VITE_VERCEL_ANALYTICS_ID = process.env.VERCEL_ANALYTICS_ID;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()] as any,
    test: {
        globals: true,
        environment: 'happy-dom',
    },
    build: {
        // Set the output directory to match what CRA uses:
        outDir: 'build',
    },

    resolve: {
        alias: {
            '~': alias('./src'),
            ...tsconfigPaths,
        },
    },
});
