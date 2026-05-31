# Generate & Run

By the end of [Getting Started](/guide/getting-started) you have a valid,
version-pinned `agent.yaml`. This page takes you the rest of the way:
install the reference generator, turn the manifest into a project, and run
the agent locally.

ADL itself ships nothing but the schema - turning a manifest into running
code is the job of a **consumer**. The reference consumer is
[`adl-cli`](https://github.com/inference-gateway/adl-cli). This page shows
the happy path; the CLI's own repo is the source of truth for every flag
and stays current as the tool evolves.

## 1. Install adl-cli

The quickest path is the install script, which drops an `adl` binary on
your `PATH`:

```sh
curl -fsSL https://raw.githubusercontent.com/inference-gateway/adl-cli/main/install.sh | bash
```

Prefer a different route? Any of these also work:

```sh
# Go toolchain
go install github.com/inference-gateway/adl-cli@latest

# Nix - run without installing
nix run github:inference-gateway/adl-cli
```

Just as you pinned the schema to a tag, pin the generator: production
setups should install a specific `adl-cli` release rather than tracking
`main`.

## 2. Generate from your manifest

Point `adl generate` at the manifest and pick an output directory:

```sh
adl generate --file agent.yaml --output ./hello-agent
```

Generation is non-destructive. On a re-run the CLI honours `.adl-ignore`
(which it writes into the project) so your edited files are left alone;
pass `--overwrite` to force regeneration of everything else.

A few flags layer on optional artifacts - they map directly to the spec
blocks below:

| Flag                       | Adds                                                       |
| -------------------------- | --------------------------------------------------------- |
| `--ci`                     | GitHub Actions CI workflow (or set `spec.scm.ci: true`).  |
| `--cd`                     | CD pipeline + `semantic-release` (or `spec.scm.cd: true`).|
| `--deployment kubernetes`  | `k8s/deployment.yaml` (or set `spec.deployment`).         |
| `--deployment cloudrun`    | A Cloud Run `deploy` task (or set `spec.deployment`).     |

## 3. What you get

The generator emits **only what your spec asks for**. Each generated piece
traces back to a block in the manifest:

| `spec.*` block                       | What the generator emits                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| `metadata` + `capabilities` + `card` | `.well-known/agent-card.json` - the A2A discovery + capabilities manifest.      |
| `language.<lang>`                    | Project skeleton (`go.mod`/`Cargo.toml`, `main.*`), `Dockerfile`, `Taskfile.yml`. |
| `server`                             | HTTP server wiring (listen port, debug) in the entry point.                     |
| `agent`                              | LLM provider/model wiring. Omitted entirely for a [no-LLM agent](/examples/no-llm). |
| `tools[]`                            | One stub per tool under `tools/`, each with a `TODO` for you to implement.       |
| `skills[]`                           | One directory per skill under `skills/` (`SKILL.md` + assets), listed on the card. |
| `services`                           | Typed dependency-injection interfaces and factory functions.                    |
| `config`                             | A `config/` package with environment-variable mapping.                          |
| `development.sandbox`                | `.flox/` and/or `.devcontainer/` for a reproducible dev shell.                  |
| `development.ai.orchestrators`       | `CLAUDE.md` / `GEMINI.md` / `AGENTS.md` for the enabled coding agents.          |
| `scm.ci` / `scm.cd`                  | `.github/workflows/ci.yml`, `cd.yml`, and `.releaserc.yaml`.                    |
| `deployment`                         | `k8s/deployment.yaml` (Kubernetes) or a Cloud Run `deploy` task.               |

Blocks you leave out simply produce nothing. The minimal manifest from
Getting Started - no `tools`, `skills`, `services`, or `deployment` - yields
a small but complete and runnable project:

```text
hello-agent/
├── main.go                     # server wired from spec.server + spec.language
├── go.mod
├── Dockerfile
├── Taskfile.yml                # build / test / lint / run
├── .well-known/
│   └── agent-card.json         # from metadata + spec.capabilities
└── README.md
```

Layer on `spec.tools`, `spec.skills`, `spec.development`, or
`spec.deployment` and the corresponding `tools/`, `skills/`, `.flox/`, or
`k8s/` directories appear alongside it.

## 4. Run it locally

The generated `Taskfile.yml` is the entry point. Build, then run:

```sh
cd hello-agent
task build
task run
```

The server listens on the port from `spec.server.port` (`8080` in the
Getting Started manifest). Confirm it is up by fetching the agent card:

```sh
curl http://localhost:8080/.well-known/agent-card.json
```

If your manifest declared `spec.tools`, the stubs under `tools/` return
placeholder data until you replace each `TODO` with real logic - the
project builds and runs before you write a line of business logic, so you
can see the agent answer first and fill in behaviour incrementally.

## Where to go deeper

This page is the happy path. For everything else - the interactive
`adl init` wizard, the full flag matrix, sandbox and CI/CD details, and
per-language options - see the
[`adl-cli` repository](https://github.com/inference-gateway/adl-cli).

- [Tools vs Skills](/guide/tools-vs-skills) - decide what belongs in
  `tools/` (the stubs you implement) versus `skills/` (the playbooks you
  write).
- [Examples](/examples/) - manifests for richer shapes; generate any of
  them with the same two commands.
