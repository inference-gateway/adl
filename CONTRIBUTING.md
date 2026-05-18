# Contributing to ADL

Thank you for your interest in contributing to the [Agent Definition Language](./README.md). This repository is the source of truth for the ADL JSON Schema, and this document explains how to propose changes, validate them locally, and get them released.

## Table of Contents

- [Contributing to ADL](#contributing-to-adl)
  - [Development Setup](#development-setup)
  - [Development Process](#development-process)
  - [Schema Versioning Rules](#schema-versioning-rules)
  - [Commit Message Convention](#commit-message-convention)
  - [Pull Request Process](#pull-request-process)
  - [Release Process](#release-process)
  - [Getting Help](#getting-help)

## Development Setup

This repository has no language toolchain of its own. The schema is validated with [`ajv`](https://ajv.js.org), which is the same path CI takes. You can set up the environment automatically with [flox](https://flox.dev) (recommended) or manually.

### Option A: flox (recommended)

[flox](https://flox.dev) provisions a reproducible per-directory environment with Node.js, [go-task](https://taskfile.dev), and the ajv toolchain pre-installed. Activating the environment also runs `npm install` for the ajv packages automatically (see `.flox/env/manifest.toml`).

1. [Install flox](https://flox.dev/docs/install-flox/).
2. From the repo root:

```sh
flox activate
```

That's it. `task`, `node`, and the ajv binaries (`node_modules/.bin/ajv`) are now on `PATH`.

### Option B: manual

If you'd rather not use flox, you only need Node.js 24.x (matches `.github/workflows/validate-schema.yml`) and Git:

```sh
git clone https://github.com/inference-gateway/adl
cd adl
npm install --no-save ajv@8 ajv-cli@5 ajv-formats@3
```

These are the same package versions CI installs. There is no `package.json` on purpose: the install is one-off and local to your working tree.

## Development Process

1. Create a new branch:

```sh
git checkout -b my-change
```

2. Edit `schema/v1/schema.json` (or, for a future major version, `schema/v2/schema.json`, see [Schema Versioning Rules](#schema-versioning-rules)).

3. Compile the schema locally. This is the exact check CI runs:

```sh
task compile
# or, without go-task:
npx ajv compile --spec=draft7 -c ajv-formats -s schema/v1/schema.json
```

4. If your change affects manifest authoring, validate a real manifest against the updated schema:

```sh
task validate -- path/to/manifest.yaml
# or, without go-task:
npx ajv validate --spec=draft7 -c ajv-formats -s schema/v1/schema.json -d path/to/manifest.yaml
```

5. (Optional) Test the downstream effect on consumers by pointing the [`adl-cli`](https://github.com/inference-gateway/adl-cli) `Taskfile.yml` at your local copy of `schema/v1/schema.json` and regenerating a sample project.

## Schema Versioning Rules

ADL follows a strict additive contract within a major version. This is the most important rule in the repository, please read it before opening a PR.

- **Within `schema/v1/`**: only backwards-compatible additions are allowed. Examples: new optional fields, new entries in `definitions`, new enum values (where consumers are documented to tolerate unknowns). Removing a field, tightening a constraint, renaming, or making an optional field required is a breaking change and is not allowed.
- **Released tags are immutable.** Once a tag (`v1.x.y`) ships, the schema file at that tag never changes. Consumers pin to a tag.
- **Proposing a new major version (v2)**: open a GitHub Discussion or issue first to align on scope. A v2 lives at `schema/v2/schema.json` alongside `schema/v1/`, v1 is not removed. The `apiVersion` string and the directory move together (`adl.inference-gateway.com/v2` and `schema/v2/`).

## Commit Message Convention

This repository uses [Conventional Commits](https://www.conventionalcommits.org). `semantic-release` parses commit messages to determine the next version and to generate the changelog, so the prefix matters.

The accepted types (from `.releaserc.yaml`) are:

- `feat`: new schema field or capability (minor release)
- `fix`: schema bug fix (patch)
- `impr`: improvement (patch)
- `refactor`: change that is neither a feat nor a fix (patch)
- `perf`: performance-oriented change (patch)
- `docs`: documentation only (patch)
- `style`: formatting (patch)
- `test`: tests only (patch)
- `build`: build/tooling (patch)
- `ci`: CI configuration (patch)
- `chore`: miscellaneous (patch, except `chore(release):` which is excluded)

Example:

```
feat(schema): Add optional `metadata.labels` map to Agent

Allows consumers to attach arbitrary key/value labels at the manifest
level, mirroring Kubernetes-style metadata. Purely additive.
```

## Pull Request Process

Before opening a PR, please confirm:

- [ ] `task compile` (or `npx ajv compile --spec=draft7 -c ajv-formats -s schema/v1/schema.json`) succeeds locally.
- [ ] Any manifest examples in the README or in your PR description validate against the updated schema.
- [ ] The change is additive within an existing major version, or you have an accepted Discussion/issue for a new major version.
- [ ] The PR title follows the [commit convention](#commit-message-convention) (the title becomes the squash-merge commit message).
- [ ] The README is updated if you introduce a new top-level field or capability that authors should know about.

The `validate-schema.yml` workflow runs on every PR and must pass before merge.

## Release Process

Releases are cut **manually** by a maintainer, not automatically on merge to `main`.

1. A maintainer triggers the `Release` workflow (`.github/workflows/release.yml`) from the GitHub Actions tab via `workflow_dispatch`.
2. The workflow runs [semantic-release](https://semantic-release.gitbook.io), which derives the next version from the commit messages since the last tag (see [Commit Message Convention](#commit-message-convention)).
3. If there are releasable commits, `CHANGELOG.md` is updated, a GitHub release is published, and a `vX.Y.Z` tag is created. If not, the workflow exits cleanly with no release.
4. Branches matching `rc/*` publish to the `rc` channel for pre-release testing (same manual trigger, run from the rc branch).

Contributors do not need to bump versions or edit the changelog. Just land your PR with a well-formed commit title and a maintainer will pick it up in the next release run.

## Getting Help

- File an issue in [GitHub Issues](https://github.com/inference-gateway/adl/issues).
- For questions about the schema shape itself, the canonical reference is [`schema/v1/schema.json`](./schema/v1/schema.json).
