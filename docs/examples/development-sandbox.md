# Development Sandbox

[`spec.development`](/reference/development) describes the **local
developer experience** for the generated project, independent of what
the agent does at runtime: a reproducible sandbox to work in, optional
coding-agent orchestrators provisioned inside it, and extra
sandbox-level tools. This agent turns all three on.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: platform-agent
  description: Internal platform agent with a reproducible dev sandbox
  version: "0.4.0"
  tags:
    - platform
    - internal
spec:
  capabilities:
    streaming: true
    pushNotifications: false
    stateTransitionHistory: false

  agent:
    provider: anthropic
    model: claude-sonnet-4-7
    systemPrompt: |
      You help platform engineers inspect clusters and infrastructure.
      Prefer read-only commands and explain any change before you make it.

  server:
    port: 8080

  language:
    go:
      module: github.com/example/platform-agent
      version: "1.26"

  development:
    sandbox:
      flox:
        enabled: true
      devcontainer:
        enabled: true
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
      - kubectl@1.31.0
      - terraform@1.9.5
      - deno@2.1.4
```

## Highlights

- **Two ways into the same sandbox.** `flox` and `devcontainer` are both
  enabled, so a contributor can `flox activate` for a Nixpkgs dev shell
  or open the project in a Dev Container - whichever they prefer.
  `dockerCompose` is left off. The three are alternative packagings of
  the same environment; enabling more than one is allowed. See
  [`sandbox`](/reference/development#sandbox).
- **One orchestrator provisioned.** Only `claudecode` is enabled under
  [`ai.orchestrators`](/reference/development#ai), so the generated
  sandbox ships with Claude Code wired up. Every orchestrator is
  disabled by default, so the explicit `enabled: false` entries are just
  for illustration - you could omit them and get the same result.
- **`deps` are language-agnostic.** `kubectl`, `terraform`, and `deno`
  aren't Go packages, so they don't belong under
  [`language.go.vendor`](/reference/language#vendor-config). They go in
  [`development.deps`](/reference/development#deps) instead, which
  installs them into the sandbox itself. Each entry is
  `<package>@<version>`; the consumer resolves it against the sandbox's
  native package source (Nixpkgs for flox, a feature/apt for
  devcontainer).
- **Independent of deployment.** Nothing here affects the running agent
  or how it ships - `spec.development` only shapes the project a
  developer clones and works in. Pair it with a
  [`deployment`](/examples/deployment) block when you're ready to ship.
