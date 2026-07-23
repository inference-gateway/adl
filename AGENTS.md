# Repository Guidelines

## Project Structure & Module Organization

This repository is the source of truth for the ADL JSON Schema. The canonical schema lives at `schema/v1/schema.json` and targets `apiVersion: adl.inference-gateway.com/v1`. Add a future breaking major version as a sibling directory, for example `schema/v2/schema.json`, without removing older versions. Project documentation is in `README.md` and contribution/release rules are in `CONTRIBUTING.md`. Automation lives in `Taskfile.yml`, with GitHub workflows under `.github/workflows/`.

## Build, Test, and Development Commands

- `task`: list available repository tasks.
- `task compile`: compile `schema/v1/schema.json` with AJV Draft-07 and `ajv-formats`; this is the same validation path CI uses.
- `task validate -- path/to/manifest.yaml`: validate a manifest file against the schema.
- `npx ajv compile --spec=draft7 -c ajv-formats -s schema/v1/schema.json`: manual equivalent when `go-task` is unavailable.

Use `flox activate` for the recommended local environment. Manual setup requires Node.js 24.x and `npm install --no-save ajv@8 ajv-cli@5 ajv-formats@3`.

## Coding Style & Naming Conventions

Keep JSON Schema changes readable with two-space indentation and stable key ordering near related fields. Prefer descriptive schema property names that match existing ADL manifest style, such as `apiVersion`, `metadata`, `spec`, `tools`, and `skills`. Within `schema/v1/`, make only backwards-compatible additions: optional fields, new definitions, or documented additive enum values. Do not tighten constraints, rename fields, or make optional fields required in an existing major version.

## Testing Guidelines

There is no separate unit test suite; schema compilation is the required test. Run `task compile` before every PR. When changing author-facing behavior, also validate at least one representative manifest with `task validate -- path/to/manifest.yaml` and update examples in `README.md` if needed.

## Commit & Pull Request Guidelines

Use Conventional Commits because semantic-release derives versions from commit titles. Common examples are `feat(schema): add metadata labels`, `fix(schema): relax skill license validation`, and `docs: update manifest example`. Recent history also uses `chore:` for maintenance-only changes.

Before opening a PR, confirm `task compile` passes, include a short description of the schema impact, link any relevant issue or discussion, and note any manifest examples you validated. PR titles should follow the same commit convention because squash merges use the title as the final commit message.

## Making a schema change (end to end)

The only shipped artifact is `schema/v1/schema.json`. Downstream tools (notably [`adl-cli`](https://github.com/inference-gateway/adl-cli)) pin it by git ref, so changes flow through a fixed process:

1. **Edit the schema.** Inside `schema/v1/`, make only backwards-compatible additions (new optional fields, new `definitions`, additive enum values). Removing/renaming a field, tightening a constraint, or making an optional field required is breaking — it requires a new `schema/v2/` directory and a new `apiVersion` (`adl.inference-gateway.com/v2`); v1 is kept, not removed.
2. **Validate locally.** Run `task compile` (the exact check CI runs), and `task validate -- <manifest>` against at least one representative manifest. If the change is consumer-facing, update the example and prose in `README.md` and re-run `task validate` on it.
3. **Open a PR.** Conventional Commit title (`feat(schema):` for additions, `fix(schema):` for relaxations) — the squash merge uses the PR title, and semantic-release derives the version from it.
4. **Release.** A maintainer runs the **Release** workflow via `workflow_dispatch` (releases are manual, not on merge). This cuts an immutable `vX.Y.Z` tag — never edit a released tag, since consumers pin to it.
5. **Propagate to `adl-cli`.** Run the **Sync adl-cli** workflow (`.github/workflows/sync-adl-cli.yml`) via `workflow_dispatch`; leave `ref` empty to use the latest release tag. It sends a `repository_dispatch` (`event_type: schema-sync`) to `adl-cli`, whose `sync-schema.yml` workflow bumps `ADL_SCHEMA_VERSION`, re-fetches the schema, regenerates its Go types, and opens a PR. Review and merge that PR to complete the sync.

## Security & Configuration Tips

Do not commit local environment files or generated dependency folders such as `node_modules/` (there is no `package.json` on purpose — the AJV install is a one-off, local to the working tree). Treat released tags as immutable because downstream consumers pin schema versions. If a proposed change is breaking, open an issue or discussion for a new major version before editing the schema.
