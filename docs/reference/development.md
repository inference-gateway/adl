# `spec.development`

Everything about the **local developer experience** for the agent
project: reproducible sandboxes, AI coding-agent integration, and extra
sandbox-level dependencies.

```yaml
spec:
  development:
    sandbox:
      flox:
        enabled: true
      devcontainer:
        enabled: false
      dockerCompose:
        enabled: false
    ai:
      claudecode:
        enabled: true
      codex:
        enabled: false
      gemini:
        enabled: false
      opencode:
        enabled: false
      infer:
        enabled: false
    deps:
      - deno@2.1.4
      - kubectl@1.31.0
      - terraform@1.9.5
```

## Fields

| Field     | Reference           | Description                                                                 |
| --------- | ------------------- | --------------------------------------------------------------------------- |
| `sandbox` | [sandbox](#sandbox) | Reproducible dev environments (flox, devcontainer, dockerCompose).          |
| `ai`      | [ai](#ai)           | AI coding-agent provisioning (Claude Code, Codex, Gemini, OpenCode, Infer). |
| `deps`    | [deps](#deps)       | Sandbox-level extra packages (cross-cutting, language-agnostic).            |

## `sandbox` {#sandbox}

Selects reproducible dev environments. `flox`, `devcontainer`, and
`dockerCompose` are alternative ways to package the same sandbox; pick
what suits the team. Each is independently toggleable.

```yaml
spec:
  development:
    sandbox:
      flox:
        enabled: true
      devcontainer:
        enabled: false
      dockerCompose:
        enabled: false
```

| Sandbox         | When to use                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `flox`          | Reproducible per-project dev shells via Nixpkgs, no container layer needed. |
| `devcontainer`  | VS Code (and compatible) Dev Containers - boots the project in a container. |
| `dockerCompose` | Existing multi-service Docker Compose stack you want the agent to live in.  |

Each sub-block has the shape `{ enabled: boolean }`. Enabling more than
one is allowed if your project wants to ship multiple ways to enter the
sandbox.

## `ai` {#ai}

Configures generation of AI-assistant documentation (`CLAUDE.md`,
`AGENTS.md`) and provisioning of coding agents inside the sandbox. Each
supported coding agent is toggled independently, and every agent is
**disabled by default**.

```yaml
spec:
  development:
    ai:
      claudecode:
        enabled: true
      codex:
        enabled: false
      gemini:
        enabled: false
      opencode:
        enabled: false
      infer:
        enabled: false
```

| Field                | Coding agent                  |
| -------------------- | ----------------------------- |
| `claudecode.enabled` | Anthropic **Claude Code**     |
| `codex.enabled`      | OpenAI **Codex**              |
| `gemini.enabled`     | Google **Gemini**             |
| `opencode.enabled`   | **OpenCode**                  |
| `infer.enabled`      | Inference Gateway **`infer`** |

Each sub-block has the shape `{ enabled: boolean }`. Multiple agents
can be enabled at once if a project wants to ship configuration for
more than one.

## `deps` {#deps}

Extra packages to install into the **development sandbox itself** (flox,
devcontainer, dockerCompose) on top of whatever the generator pulls in
by default.

Use this for cross-cutting tools that **aren't tied to a single
language** - e.g. a Go service that also needs `deno` for quick
scripting, or a TypeScript agent that wants `kubectl` available in the
dev shell.

```yaml
spec:
  development:
    sandbox:
      flox:
        enabled: true
    deps:
      - deno@2.1.4
      - kubectl@1.31.0
      - terraform@1.9.5
```

| Aspect         | Detail                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Shape**      | `string[]`, each entry matching `^\S+@\S+$` (i.e. `<package>@<version>`).                                                 |
| **Default**    | Empty.                                                                                                                    |
| **Resolution** | Consumer responsibility: Nixpkgs for flox, apt/apk/devcontainer feature for devcontainer, image layers for dockerCompose. |

The schema only validates the `<package>@<version>` shape. Consumers
(e.g. `adl-cli`) are responsible for resolving each entry against the
sandbox's native package source.

> If you need a package that _is_ tied to a specific language, use that
> language's [`vendor.deps` / `vendor.devdeps`](./language#vendor-config)
> instead.
