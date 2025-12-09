import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  optimizeDeps: {
    exclude: ['@mediapipe/face_mesh', '@mediapipe/camera_utils', '@mediapipe/drawing_utils']
  }
})
