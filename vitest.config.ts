import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            Sass: fileURLToPath(new URL('./resources/sass', import.meta.url)),
            JS: fileURLToPath(new URL('./resources/js', import.meta.url)),
            Components: fileURLToPath(new URL('./resources/js/components', import.meta.url)),
            Constants: fileURLToPath(new URL('./resources/js/constants', import.meta.url)),
        },
    },
    test: {
        clearMocks: true,
        environment: 'jsdom',
        setupFiles: ['./resources/js/test/setup.ts'],
    },
})
