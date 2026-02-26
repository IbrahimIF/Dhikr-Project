import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // This is important for Electron to find the assets
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})