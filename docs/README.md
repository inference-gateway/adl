# ADL Documentation Site

This directory contains the [VitePress](https://vitepress.dev/) source for
the ADL documentation site, published at
**https://adl.inference-gateway.com/** via GitHub Pages.

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

## Deployment

The site is built and published by
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) on every
push to `main` that touches `docs/**`. GitHub Pages must be configured with
the "GitHub Actions" build source (Settings → Pages). The custom domain
`adl.inference-gateway.com` is preserved on each deploy via
[`docs/public/CNAME`](./public/CNAME).

## Contributing

Open a PR. Follow the repo's
[Conventional Commits](../CONTRIBUTING.md) convention — `docs:` for
content-only changes, `feat(docs):` for new pages or sections.
