import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [ react(),
    tailwindcss(),
  ],
  base:"https://codeartist7071.github.io/bookbot/"
})