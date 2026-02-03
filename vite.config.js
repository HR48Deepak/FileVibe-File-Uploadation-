import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),
  tailwindcss()
  ],
  server: {
    port: 3000,
  strictPort: true,
    headers: {
      // "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      // "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "unsafe-none",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
})
