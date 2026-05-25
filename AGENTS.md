# Repository Guidelines

## Project Structure & Module Organization

This repository is the source of truth for the ADL JSON Schema, not an application runtime. The shipped artifact is `schema/v1/schema.json`, a JSON Schema Draft-07 document for `apiVersion: adl.inference-gateway.com/v1`. Future breaking versions should live beside it, for example `schema/v2/schema.json`, with `apiVersion` updated in lockstep.

Top-level docs include `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`, and `CHANGELOG.md`. Tooling lives in `Taskfile.yml`, `.github/workflows/`, `.releaserc.yaml`, and `.flox/env/`.

## Build, Test, and Development Commands

Use `flox activate` for the recommended environment. It provisions Node.js, go-task, and AJV packages.

Key commands:

- `task --list`: show available tasks.
- `task compile`: compile `schema/v1/schema.json`; this is the same check CI runs.
- `task validate -- path/to/manifest.yaml`: validate an ADL manifest against the schema.
- `npx ajv compile --spec=draft7 -c ajv-formats -s schema/v1/schema.json`: manual compile command.

There is intentionally no `package.json`; install AJV ad hoc with `npm install --no-save ajv@8 ajv-cli@5 ajv-formats@3` if not using flox.

## Coding Style & Naming Conventions

Edit schema JSON directly and keep changes minimal. Follow existing Draft-07 patterns: reusable shapes belong in `definitions`, shared validation should use `$ref`, and properties should include clear `description` text. Prefer lowercase enum values and existing naming conventions in the schema. Do not add application code, runtime tests, or unrelated top-level files.

Within `schema/v1/`, only backwards-compatible additions are allowed: new optional fields, definitions, or tolerated enum additions. Removing, renaming, tightening constraints, or making optional fields required needs a new major directory.

## Testing Guidelines

The primary test is schema compilation via `task compile`. When changing author-facing behavior, also validate a representative manifest with `task validate -- path/to/manifest.yaml`. If the README example changes, make sure it still validates. Optionally test `adl-cli` against the local schema.

## Commit & Pull Request Guidelines

Use Conventional Commits. Recent history follows patterns such as `feat: Add ...`, `chore: ...`, `ci(deps): ...`, and `chore(release): ...`. Accepted types include `feat`, `fix`, `impr`, `refactor`, `perf`, `docs`, `style`, `test`, `build`, `ci`, and `chore`.

Before opening a PR, run `task compile`, update `README.md` for new top-level fields or capabilities, and confirm the change is additive for v1. PR titles become squash-merge commit messages, so use the same convention. Releases are maintainer-triggered manually; do not edit `CHANGELOG.md` or bump versions in normal PRs.
