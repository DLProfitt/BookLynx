import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dir2json from 'vite-plugin-dir2json';

export default defineConfig({
  plugins: [
    react(),
    dir2json({
      input: 'public/books', // Directory to read files from
      output: 'src/data/books.json', // Output JSON file
      extensions: ['json'] // Extensions to consider
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000' // Proxy API requests to the backend server
    }
  }
});
