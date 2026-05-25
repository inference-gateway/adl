# Getting Started

This page walks through writing your first ADL manifest and validating it
against the schema.

## Prerequisites

You need either:

- **Node.js 24** (matches CI), or
- **[flox](https://flox.dev/)** — `flox activate` in the schema repo runs
  `npm install` of `ajv`, `ajv-cli`, and `ajv-formats` for you.

## 1. Write a minimal manifest

Create `agent.yaml`:

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

Every field above is required by the schema. We'll layer on the optional
ones later.

## 2. Validate it

If you have [`go-task`](https://taskfile.dev) installed and you're inside
the [schema repo](https://github.com/inference-gateway/adl):

```sh
task validate -- ./agent.yaml
```

Otherwise, run `ajv` directly:

```sh
npx ajv validate \
  --spec=draft7 \
  -c ajv-formats \
  -s schema/v1/schema.json \
  -d agent.yaml
```

A valid manifest prints `agent.yaml valid`. An invalid one prints the
specific path, expected type, and offending value.

## 3. Pin the schema version

Once your manifest passes validation, decide which **tag** of the schema
you want to pin against. Released schema tags are immutable — once `vX.Y.Z`
is cut, the schema file at that tag never changes. Consumers (including
`adl-cli`) pin to a specific tag in their `Taskfile.yml` or equivalent, so
your manifests stay valid for the lifetime of the consumer's pin.

```yaml
# Example: pinning in a Taskfile
vars:
  ADL_SCHEMA_REF: v1.3.0
  ADL_SCHEMA_URL: https://raw.githubusercontent.com/inference-gateway/adl/{{.ADL_SCHEMA_REF}}/schema/v1/schema.json
```

## 4. Generate a project (optional)

If you want code, not just a manifest, feed your YAML to
[`adl-cli`](https://github.com/inference-gateway/adl-cli) — the reference
generator. It emits a complete agent project (server, handlers, tests,
sandbox, CI, and deployment manifests) in the language you chose under
`spec.language`.

## What to read next

- [Tools vs Skills](/guide/tools-vs-skills) — the most important concept
  in ADL, and the one most people get wrong on first read.
- [Reference: `metadata`](/reference/metadata) and
  [Reference: `spec`](/reference/spec) — the two halves of the manifest.
- [Examples](/examples/) — copy-pasteable manifests for common shapes.
