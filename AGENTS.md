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

## Security & Configuration Tips

Do not commit local environment files or generated dependency folders such as `node_modules/`. Treat released tags as immutable because downstream consumers pin schema versions. If a proposed change is breaking, open an issue or discussion for a new major version before editing the schema.
