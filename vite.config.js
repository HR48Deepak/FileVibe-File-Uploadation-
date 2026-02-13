import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  
  ],
  // base:'/FileVibe-File-Uploadation-/',
  server: {
    // port: 3000,
    // strictPort: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
})
