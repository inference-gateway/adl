# ADL Documentation Site

This directory contains the [VitePress](https://vitepress.dev/) source for
the ADL documentation site, published at
**https://adl.inference-gateway.com/v1/** via GitHub Pages.

The site is the long-form companion to the canonical schema at
[`schema/v1/schema.json`](../schema/v1/schema.json). The schema validates;
the site explains.

## Local development

The docs site has its own `package.json` (it's a Vite project, not the
schema-validation tooling). Node 20+ is recommended.

```sh
cd docs

# Install dependencies
npm install

# Start the dev server (hot reload at http://localhost:5173)
npm run dev

# Build the static site into .vitepress/dist/
npm run build

# Preview the production build locally
npm run preview
```

> The root of the repo intentionally has no `package.json` — see the root
> [`CLAUDE.md`](../CLAUDE.md). The `docs/package.json` is scoped to this
> Vite project and is separate from the ad-hoc `ajv` install used to
> validate the schema itself.

## Directory layout

```
docs/
├── .vitepress/
│   └── config.ts          # VitePress site config (nav, sidebar, base path)
├── public/
│   └── CNAME              # GitHub Pages custom domain (adl.inference-gateway.com)
├── guide/                 # Conceptual guide pages
├── reference/             # Per-field schema reference
├── examples/              # Copy-pasteable ADL manifests
├── index.md               # Landing page (Hero + features)
├── package.json           # VitePress + Vue dev deps
└── README.md              # This file
```

## Base path

The site is configured with `base: '/v1/'` in
[`.vitepress/config.ts`](./.vitepress/config.ts) so that the published
URL is `https://adl.inference-gateway.com/v1/`. The `/v1/` prefix
mirrors the schema's major-version directory (`schema/v1/`) so a future
v2 site can live at `/v2/` without colliding with v1.

## Deployment

> **Setup required.** The GitHub Pages deployment workflow needs to be
> created by a repo maintainer — the bot that opens this PR doesn't have
> permission to modify files under `.github/workflows/`. A reference
> workflow that builds the site and publishes it to GitHub Pages is
> outlined below.

1. In the repository settings, enable **GitHub Pages** with the
   "GitHub Actions" build source.
2. Add the custom domain `adl.inference-gateway.com` and configure the
   DNS `CNAME` record at the registrar to point at GitHub Pages. The
   `docs/public/CNAME` file in this directory ensures the domain is
   preserved on each deploy.
3. Add a workflow under `.github/workflows/deploy-docs.yml` along the
   lines of:

   ```yaml
   name: Deploy docs

   on:
     push:
       branches: [main]
       paths: ['docs/**', '.github/workflows/deploy-docs.yml']
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: pages
     cancel-in-progress: false

   jobs:
     build:
       runs-on: ubuntu-24.04
       steps:
         - uses: actions/checkout@v6
         - uses: actions/setup-node@v6
           with:
             node-version: '24.15.0'
         - run: npm ci
           working-directory: docs
         - run: npm run build
           working-directory: docs
         - uses: actions/configure-pages@v6
         - uses: actions/upload-pages-artifact@v4
           with:
             path: docs/.vitepress/dist

     deploy:
       needs: build
       runs-on: ubuntu-24.04
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v5
   ```

## Contributing

Open a PR. Follow the repo's
[Conventional Commits](../CONTRIBUTING.md) convention — `docs:` for
content-only changes, `feat(docs):` for new pages or sections.
