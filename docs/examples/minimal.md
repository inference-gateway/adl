# Minimal Agent

The smallest manifest that passes validation. Use this as a starting
point and layer on optional blocks as needed.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: hello-agent
  description: Smallest valid ADL manifest
  version: "0.1.0"
spec:
  capabilities:
    streaming: true
    pushNotifications: false
    stateTransitionHistory: false
  server:
    port: 8080
  language:
    go:
      module: github.com/example/hello-agent
      version: "1.26"
```

## What's required (and why)

The schema demands four top-level fields — `apiVersion`, `kind`,
`metadata`, `spec` — and three inside `spec`: `capabilities`, `server`,
`language`. Every other block is opt-in.

| Block                    | Why it's required                                                                                |
|--------------------------|--------------------------------------------------------------------------------------------------|
| `apiVersion` + `kind`    | Discriminators. They tell validators which schema to apply and reserve future kinds.             |
| `metadata.{name,description,version}` | Identity. Without these, registries and generated projects have nothing to call the agent. |
| `spec.capabilities`      | Protocol contract. Runtimes shouldn't have to guess about streaming, push, or history.            |
| `spec.server`            | Where the agent listens. The generator can't emit a service without a port.                       |
| `spec.language`          | What to generate. At least one target language is needed for the generator to do its job.         |

## What you can add next

- An [`agent`](/reference/agent) block to pick a provider, model, and
  system prompt.
- [`tools`](/reference/tools) for function-call entrypoints.
- [`skills`](/reference/skills) for markdown playbooks.
- A [`development`](/reference/development) block to enable a flox or
  devcontainer sandbox, and optionally a coding agent inside it.
- A [`deployment`](/reference/deployment) block to target Kubernetes or
  Cloud Run.
