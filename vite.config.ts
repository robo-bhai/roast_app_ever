import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'app.uqn88.store',
      'api.uqn88.store',
      '.uqn88.store',
      '.trycloudflare.com',
      'all' // Ya kisi bhi host ko allow karne ke liye true / 'all' set kar sakte hain
    ]
  }
})
