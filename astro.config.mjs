// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://profile.milix-m.com',
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'misskey-hub.net' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  vite: {
    ssr: {
      noExternal: ['react-icons']
    },
    plugins: [tailwindcss()]
  },

  integrations: [react(), partytown({ config: { forward: ['dataLayer.push'] } })],
});
