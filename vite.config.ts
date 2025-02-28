import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    https: {
      cert: fs.readFileSync('src/ssl/code.crt'),
      key: fs.readFileSync('src/ssl/code.key'),
    }
  }
})
