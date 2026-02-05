import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          spline: ['@splinetool/react-spline', '@splinetool/runtime'],
          animations: ['framer-motion', 'gsap', 'animejs'],
        }
      }
    }
  }
})
