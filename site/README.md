# Stillpoint

Stillpoint is a meditation information and practice tracker built with React 19, Vite, TypeScript, Hono, Cloudflare Pages Functions, D1, and shared Zod schemas.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Cloudflare Git-connected deployment

In Cloudflare Pages, connect the GitHub repository and set the project root directory to `site`. Use `npm run build` as the build command and `site/dist` as the output directory (or `dist` when the root directory is set to `site`). Add a D1 binding named `DB`. Apply `migrations/0001_create_meditation_sessions.sql` to the production D1 database before enabling the tracker.

The `functions/` directory is picked up automatically by Pages Functions, so Wrangler is not required for day-to-day deployments.
