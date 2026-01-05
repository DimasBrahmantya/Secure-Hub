import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/Secure-Hub/',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']], // React Compiler
      },
    }),

    tailwindcss(), // Tailwind plugin
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // alias
    },
  },
});
