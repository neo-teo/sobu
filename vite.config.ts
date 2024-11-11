import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    server: {
        port: 5173,
        open: true
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
});