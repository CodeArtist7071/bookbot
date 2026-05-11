import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [ react(),
    tailwindcss(),
  ],
  base:"https://bookbot2-1-xg21.onrender.com"
})