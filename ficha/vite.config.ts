import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base './' keeps asset paths relative, so the build works under GitHub Pages
// (/vampire-5e/) as well as opened from any folder.
export default defineConfig({
  base: './',
  plugins: [react()],
})
