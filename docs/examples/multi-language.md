# Multi-language Agent

The same agent generated for three languages out of a single manifest.
Useful when an agent ships both as a service (Go) and as SDK clients
(TypeScript, Rust) consuming the same contract.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: time-tracker
  description: Lightweight time-tracking agent
  version: "0.2.0"
spec:
  capabilities:
    streaming: true
    pushNotifications: false
    stateTransitionHistory: false

  agent:
    provider: anthropic
    model: claude-sonnet-4-7
    systemPrompt: You help users log time against projects.
    temperature: 0.2

  tools:
    - id: log_entry
      name: log_entry
      description: Record a time entry against a project
      tags: [time, tracking]
      schema:
        type: object
        properties:
          project: { type: string }
          hours: { type: number, minimum: 0 }
          notes: { type: string }
        required: [project, hours]

  server:
    port: 8080

  language:
    go:
      module: github.com/example/time-tracker
      version: "1.26"
      vendor:
        deps:
          - github.com/google/uuid@v1.6.0
        devdeps:
          - github.com/stretchr/testify@v1.9.0

    typescript:
      packageName: "@example/time-tracker"
      nodeVersion: "20"
      vendor:
        deps:
          - zod@3.23.0
        devdeps:
          - vitest@1.6.0
          - "@types/node@20.11.0"

    rust:
      packageName: time-tracker
      version: "0.2.0"
      edition: "2021"
      features:
        - server
      vendor:
        deps:
          - tokio@1.36.0
          - serde@1.0.200
        devdeps:
          - mockall@0.12.1
```

## What you get

For each entry under `spec.language`, the generator emits a complete
project tree using that language's idioms:

| Target       | Output                                                     |
|--------------|------------------------------------------------------------|
| `go`         | A Go module, `go.mod` with the listed `vendor` packages, idiomatic exported types and acronyms. |
| `typescript` | An npm package with the listed dependencies in `package.json`, plus tsconfig and test setup. |
| `rust`       | A Cargo crate with the listed crates in `Cargo.toml`, the requested edition, and default features enabled. |

`vendor.deps` and `vendor.devdeps` follow each language's native syntax —
the schema only validates the `<package>@<version>` shape.

## When this is overkill

If you only need one language, configure only that one. The schema
enforces `minProperties: 1` on `spec.language`, so omitting languages
you don't need is the recommended default. Reach for the multi-language
configuration when you have a real reason to keep multiple
implementations in sync.
