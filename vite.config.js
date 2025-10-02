import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    threads: false,
    pool: 'forks'
  },
  server: {
    host: true,
    allowedHosts: ['elliesmusicacademy.com', 'www.elliesmusicacademy.com']
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['elliesmusicacademy.com', 'www.elliesmusicacademy.com']
  },
});