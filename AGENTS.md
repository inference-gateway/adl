# AGENTS.md

This repository is the **source of truth for the ADL (Agent Definition Language) JSON Schema**. The only shipped artifact is `schema/v1/schema.json` (JSON Schema Draft-07, `apiVersion: adl.inference-gateway.com/v1`); there is no application code. The second surface is the docs site under `docs/` (VitePress), published to [adl.inference-gateway.com/v1](https://adl.inference-gateway.com/v1/). `README.md` covers ADL concepts and the manifest format; `CONTRIBUTING.md` covers setup, versioning, and releases in depth.

## Layout

- `schema/v1/schema.json` — the canonical schema. Everything else describes it.
- `docs/` — VitePress site (`docs/guide/`, `docs/reference/`, `docs/examples/`). Deployed by the **Deploy** workflow on any push to `main` touching `docs/**` or `schema/v1/schema.json`.

## Commands

Recommended environment: `flox activate` (provides `task`, Node.js, Prettier, ajv). Manual setup: Node.js 24.x, then `npm install --no-save ajv@8 ajv-cli@5 ajv-formats@3` — there is no `package.json` on purpose and the install is a one-off local to the working tree; never commit `node_modules/`.

- `task compile` — AJV-compile the schema (the exact check CI runs)
- `task validate -- path/to/manifest.yaml` — validate a manifest against the schema
- `task format` / `task format:check` — Prettier auto-format / check (CI runs `npx --yes prettier@3.8.3 --check .`)
- `npx ajv compile --spec=draft7 -c ajv-formats -s schema/v1/schema.json` — manual fallback without go-task
- Docs (inside `docs/`, which has its own `package.json` and lockfile): `npm ci`, then `npm run dev` / `npm run build` — the build must succeed before deploy

CI has two checks, both must pass: **Compile JSON Schema** (AJV) and **Check formatting** (Prettier, repo-wide including `docs/`). A `.githooks/pre-commit` hook runs Prettier on staged files; activate once per clone with `git config core.hooksPath .githooks`. If it blocks a commit, fix with `npx prettier@3.8.3 --write <file>`.

## Schema versioning contract — the most important rule

Within `schema/v1/`, only backwards-compatible additions: new optional fields, new `definitions`, additive enum values. Do **not** tighten constraints, rename fields, remove fields, or make optional fields required. A breaking change requires a new `schema/v2/schema.json` with `apiVersion: adl.inference-gateway.com/v2`; v1 is kept, not removed. Released git tags are immutable — downstream consumers (notably `adl-cli`) pin to them, so never edit a released tag. For a v2 proposal, open an issue or discussion before editing.

## Card alignment with A2A

`spec.card` mirrors the A2A `AgentCard` (currently v1.0.1, tracked via `inference-gateway/schemas`): when the wire format changes, ADL adopts the new field names and shapes as additive, optional definitions - e.g. `supportedInterfaces[]` (with its required `url`/`protocolBinding`/`protocolVersion`), `capabilities.extendedAgentCard`, `securityRequirements`. Fields that mirror pre-release AgentCard shape (`card.url`, `card.preferredTransport`, `card.protocolVersion`, `card.supportsExtendedAgentCard`, `card.security`, `capabilities.stateTransitionHistory`) are kept within v1 as deprecated transitional conveniences whose descriptions name the v1.0.1 field consumers map them onto; consumers (adl-cli, ADKs) translate them at generation time. Do not introduce further ADL-native renames of card fields, and do not promote the card fields that are required on the wire (`supportedInterfaces`) to required in the manifest - that can only happen in v2. OAuth2/OIDC security schemes (including the v1.0.1 `DeviceCodeOAuthFlow`) stay unmodelled: they are runtime concerns the ADK derives from config.

## Style and Code Readability

Two-space indentation, stable key ordering near related fields, and property names matching ADL manifest style (`apiVersion`, `metadata`, `spec`, `tools`, `skills`).

- Write self-explanatory code: clear names and small, single-purpose functions carry the intent.
  If a block needs a comment to be understood, extract it into a well-named function or variable.
- No inline comments inside function bodies.
- Doc comments on functions and types are at most 5 lines: what it does and why, not how.
- No comments above modules, packages, or files.
- Tool directives are not comments and stay where the tool needs them (lint suppressions, build
  tags, compiler pragmas, code generation markers).

## Testing

There is no unit test suite — schema compilation is the test. For author-facing changes, also validate a representative manifest with `task validate -- path/to/manifest.yaml`, and keep the three docs surfaces in sync: `README.md`, the relevant page under `docs/reference/`, and an example under `docs/examples/` when applicable.

## Commits and PRs

Use Conventional Commits; semantic-release derives the next version from commit titles, and the PR title becomes the squash-merge message. `feat(schema):` for additions, `fix(schema):` for relaxations, `fix(docs):`/`docs:` for docs-only changes, `chore:` otherwise. PR descriptions should note the schema impact and which manifests were validated.

## Releases and propagation

Releases are manual: a maintainer triggers the **Release** workflow via `workflow_dispatch` (cuts an immutable `vX.Y.Z` tag), then the **Sync adl-cli** workflow dispatches `schema-sync` to `adl-cli` so it re-fetches the schema and regenerates its Go types. Contributors never bump versions or edit `CHANGELOG.md`.

## Security

Manifests never contain secrets: credentials are runtime environment placeholders (`${VAR}`) resolved by consumers. Never commit `.env` files, keys, or `node_modules/`.