# AGENTS.md

This repository is the **source of truth for the ADL (Agent Definition Language) JSON Schema**. There is no application code — the only shipped artifact is `schema/v1/schema.json` (JSON Schema Draft-07, `apiVersion: adl.inference-gateway.com/v1`). Work here is schema edits plus docs. `README.md` covers ADL concepts and the manifest format; `CONTRIBUTING.md` covers setup, versioning, and releases in depth.

## Commands

Recommended environment: `flox activate` (provides `task`, Node.js, Prettier, ajv). Manual setup: Node.js 24.x, then `npm install --no-save ajv@8 ajv-cli@5 ajv-formats@3` — there is no `package.json` on purpose and the install is a one-off local to the working tree; never commit `node_modules/`.

- `task compile` — AJV-compile the schema (the exact check CI runs)
- `task validate -- path/to/manifest.yaml` — validate a manifest against the schema
- `task format` / `task format:check` — Prettier auto-format / check (CI runs `npx --yes prettier@3.8.3 --check .`)
- `npx ajv compile --spec=draft7 -c ajv-formats -s schema/v1/schema.json` — manual fallback without go-task

CI has two checks, both must pass: **Compile JSON Schema** (AJV) and **Check formatting** (Prettier). A `.githooks/pre-commit` hook runs Prettier on staged files; activate once per clone with `git config core.hooksPath .githooks`. If it blocks a commit, fix with `npx prettier@3.8.3 --write <file>`.

## Schema versioning contract — the most important rule

Within `schema/v1/`, only backwards-compatible additions: new optional fields, new `definitions`, additive enum values. Do **not** tighten constraints, rename fields, remove fields, or make optional fields required. A breaking change requires a new `schema/v2/schema.json` with `apiVersion: adl.inference-gateway.com/v2`; v1 is kept, not removed. Released git tags are immutable — downstream consumers (notably `adl-cli`) pin to them, so never edit a released tag. For a v2 proposal, open an issue or discussion before editing.

## Style

Two-space indentation, stable key ordering near related fields, and property names matching ADL manifest style (`apiVersion`, `metadata`, `spec`, `tools`, `skills`).

## Testing

There is no unit test suite — schema compilation is the test. For author-facing changes, also validate a representative manifest with `task validate -- path/to/manifest.yaml` and update `README.md` examples if needed.

## Commits and PRs

Use Conventional Commits; semantic-release derives the next version from commit titles, and the PR title becomes the squash-merge message. `feat(schema):` for additions, `fix(schema):` for relaxations, `docs:`/`chore:` otherwise. PR descriptions should note the schema impact and which manifests were validated.

## Releases and propagation

Releases are manual: a maintainer triggers the **Release** workflow via `workflow_dispatch` (cuts an immutable `vX.Y.Z` tag), then the **Sync adl-cli** workflow dispatches `schema-sync` to `adl-cli` so it re-fetches the schema and regenerates its Go types. Contributors never bump versions or edit `CHANGELOG.md`.

## Security

Manifests never contain secrets: credentials are runtime environment placeholders (`${VAR}`) resolved by consumers. Never commit `.env` files, keys, or `node_modules/`.
