# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This repository is the **source of truth for the ADL (Agent Definition Language) JSON Schema**. It is not an application; the only shipped artifact is `schema/v1/schema.json` (Draft-07), which downstream tools like [`adl-cli`](https://github.com/inference-gateway/adl-cli) pin to a git tag.

There is no language toolchain of its own and no `package.json`. The validator (`ajv`) is installed ad-hoc, either by `flox activate` (which runs `npm install` of `ajv@8`, `ajv-cli@5`, `ajv-formats@3` into the working tree via the `on-activate` hook in `.flox/env/manifest.toml`) or by running that same `npm install --no-save` manually. Node 24.15.0 matches CI.

## Commands

```sh
# Compile the schema (the exact check CI runs in validate-schema.yml)
task compile

# Validate a manifest against the schema
task validate -- path/to/manifest.yaml
```

Without go-task, the equivalents are:

```sh
npx ajv compile  --spec=draft7 -c ajv-formats -s schema/v1/schema.json
npx ajv validate --spec=draft7 -c ajv-formats -s schema/v1/schema.json -d path/to/manifest.yaml
```

## Schema concepts that affect editing

ADL distinguishes two ways an agent can act, and the schema models them as separate top-level arrays:

- **`spec.tools[]`** — function-call entrypoints with a JSON Schema for inputs. Consumers (e.g. `adl-cli`) generate code stubs in the target language. Use for deterministic operations (DB query, API call).
- **`spec.skills[]`** — markdown playbooks injected into the agent's system prompt at startup. Sourced from the skills registry or scaffolded blank with `bare: true`. Carry an SPDX `license` field (or `Proprietary`). Use for workflows/policies expressed in natural language.

Other notable shapes: `spec.language.<lang>.vendor.{deps,devdeps}` for extra packages per target language, and `spec.development.{sandbox,ai,deps}` for sandbox (flox/devcontainer/dockerCompose) and coding-agent (`claudecode`, `codex`, `gemini`, `opencode`, `infer`) provisioning. The schema only validates the `<package>@<version>` shape for dep entries — language- and sandbox-native package syntax is intentionally not constrained further.

## Non-obvious rules (read before editing the schema)

1. **Strict additive contract within a major version.** Inside `schema/v1/`, only backwards-compatible additions are allowed: new optional fields, new entries in `definitions`, new enum values where consumers tolerate unknowns. Removing a field, renaming, tightening a constraint, or making an optional field required is a breaking change and must NOT land in v1. A breaking change requires a new directory (`schema/v2/`) and a new `apiVersion` string (`adl.inference-gateway.com/v2`); the two move together. v1 is not removed when v2 ships.

2. **Released tags are immutable.** Once `vX.Y.Z` is cut, the schema file at that tag never changes. Consumers pin by tag, so editing history would silently break them.

3. **Conventional Commits are load-bearing.** `semantic-release` parses commit messages to decide the next version and section in `CHANGELOG.md`. Accepted types from `.releaserc.yaml`: `feat` (minor), and `fix` / `impr` / `refactor` / `perf` / `docs` / `style` / `test` / `build` / `ci` / `chore` (patch). `chore(release):` is excluded from release notes. PR titles become the squash-merge commit, so the title must follow this convention.

4. **Releases are triggered manually.** A maintainer runs the `Release` workflow via `workflow_dispatch`; it does not fire on merge to `main`. `rc/*` branches publish to the `rc` channel from the same manual trigger. Do not add automation that releases on push.

5. **Consumer-facing changes need a README update.** If a PR introduces a new top-level field or capability that manifest authors should know about, the example manifest and prose in `README.md` are part of the change. If a README example changes, re-run `task validate` against it.

6. **No `package.json` on purpose.** The ajv install is one-off and local to the working tree. Don't add a `package.json` or commit `node_modules/`.
