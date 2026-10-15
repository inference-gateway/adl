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
      orchestrators:
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

| Field     | Reference           | Description                                                                                         |
| --------- | ------------------- | --------------------------------------------------------------------------------------------------- |
| `sandbox` | [sandbox](#sandbox) | Reproducible dev environments (flox, devcontainer, dockerCompose).                                  |
| `ai`      | [ai](#ai)           | AI-assistant integration; coding-agent orchestrators (Claude Code, Codex, Gemini, OpenCode, Infer). |
| `deps`    | [deps](#deps)       | Sandbox-level extra packages (cross-cutting, language-agnostic).                                    |

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
`AGENTS.md`) and provisioning of coding-agent **orchestrators** inside
the sandbox. The orchestrators live under
`spec.development.ai.orchestrators`; each supported orchestrator is
toggled independently, and every orchestrator is **disabled by
default**.

```yaml
spec:
  development:
    ai:
      orchestrators:
        claudecode:
          enabled: true
          appIdSecret: CLAUDE_APP_ID
          appPrivateKeySecret: CLAUDE_APP_PRIVATE_KEY
        codex:
          enabled: false
        gemini:
          enabled: false
        opencode:
          enabled: false
        infer:
          enabled: false
```

| Field                              | Orchestrator                  |
| ---------------------------------- | ----------------------------- |
| `orchestrators.claudecode.enabled` | Anthropic **Claude Code**     |
| `orchestrators.codex.enabled`      | OpenAI **Codex**              |
| `orchestrators.gemini.enabled`     | Google **Gemini**             |
| `orchestrators.opencode.enabled`   | **OpenCode**                  |
| `orchestrators.infer.enabled`      | Inference Gateway **`infer`** |

Every sub-block requires `enabled`. Multiple orchestrators can be
enabled at once if a project wants to ship configuration for more than
one.

`claudecode` and `infer` additionally take two optional fields naming the
**repository secrets** that hold the GitHub App credentials used by the
generated workflow. Only the secret _names_ live in the manifest - the
values stay in the repository's secret store.

| Orchestrator | Field                 | Default                  | Holds                  |
| ------------ | --------------------- | ------------------------ | ---------------------- |
| `claudecode` | `appIdSecret`         | `CLAUDE_APP_ID`          | GitHub App client ID   |
| `claudecode` | `appPrivateKeySecret` | `CLAUDE_APP_PRIVATE_KEY` | GitHub App private key |
| `infer`      | `appIdSecret`         | `INFER_APP_ID`           | GitHub App client ID   |
| `infer`      | `appPrivateKeySecret` | `INFER_APP_PRIVATE_KEY`  | GitHub App private key |

Override them when your repository already uses different secret names.
`codex`, `gemini` and `opencode` have the shape `{ enabled: boolean }`
only.

### Plugins {#plugins}

`claudecode` and `infer` can also install coding-agent **plugins** in the
generated workflow before the agent runs. Plugins extend the agent that
works _on_ the project (extra skills and instructions for reviews and
implementation). They are not shipped with the agent itself - use
`spec.skills` for that.

| Orchestrator | Field                | Entry form                                         |
| ------------ | -------------------- | -------------------------------------------------- |
| `claudecode` | `plugins`            | `<plugin>@<marketplace>`, e.g. `ponytail@ponytail` |
| `claudecode` | `pluginMarketplaces` | Marketplace git URL registered before install      |
| `infer`      | `plugins`            | `owner/repo`, `owner/repo@ref`, or a GitHub URL    |

```yaml
spec:
  development:
    ai:
      orchestrators:
        claudecode:
          enabled: true
          pluginMarketplaces:
            - https://github.com/DietrichGebert/ponytail.git
          plugins:
            - ponytail@ponytail
        infer:
          enabled: true
          plugins:
            - DietrichGebert/ponytail@v4.8.4
```

Each list maps 1:1 to the matching input of the upstream action
(`plugins` / `plugin_marketplaces` for `anthropics/claude-code-action`,
`plugins` for `inference-gateway/infer-action`). Pin a tag or commit for
third-party plugins so reviews stay reproducible.

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
