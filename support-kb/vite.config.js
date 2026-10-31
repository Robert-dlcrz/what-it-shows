import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const runbook = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url));

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [
        vitePreprocess(),
        mdsvex({
          extensions: ['.svx'],
          layout: {
            runbook,
          },
        }),
      ],
      adapter: adapter({ strict: true }),
      alias: {
        '#lib': './src/lib',
      },
      prerender: {
        entries: [
          '/kb',
          '/kb/decisions/0001-dedupe-by-subject',
          '/kb/incidents/4471',
          '/kb/incidents/4471/problems',
          '/kb/triage/dedupe',
        ],
        crawl: false,
      },
    }),
  ],
});