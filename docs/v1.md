# ADL v1

`adl.inference-gateway.com/v1` is the current stable major version of the
Agent Definition Language. A manifest opts in by setting:

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
```

The schema is JSON Schema **Draft-07** and lives in the repository at
[`schema/v1/schema.json`](https://github.com/inference-gateway/adl/blob/main/schema/v1/schema.json).
Its `$id` is `https://adl.inference-gateway.com/schemas/agent/v1`.

## What's in v1

| Section                                        | Purpose                                                      |
| ---------------------------------------------- | ------------------------------------------------------------ |
| [`metadata`](/reference/metadata)              | Name, description, version, license, tags                    |
| [`spec.capabilities`](/reference/capabilities) | Streaming, push notifications, state transition history      |
| [`spec.card`](/reference/card)                 | Agent card surfaced to clients                               |
| [`spec.agent`](/reference/agent)               | Provider, model, system prompt                               |
| [`spec.config`](/reference/config)             | Runtime configuration knobs                                  |
| [`spec.services`](/reference/services)         | External services the agent talks to                         |
| [`spec.tools`](/reference/tools)               | Function-call entrypoints (deterministic operations)         |
| [`spec.skills`](/reference/skills)             | Markdown playbooks injected into the system prompt           |
| [`spec.server`](/reference/server)             | HTTP server settings                                         |
| [`spec.language`](/reference/language)         | Target language (Go, Rust, TypeScript) and deps              |
| [`spec.artifacts`](/reference/artifacts)       | Files emitted alongside the agent                            |
| [`spec.hooks`](/reference/hooks)               | Lifecycle hooks                                              |
| [`spec.scm`](/reference/scm)                   | Source-control metadata                                      |
| [`spec.development`](/reference/development)   | Sandbox (flox / devcontainer / dockerCompose) and AI tooling |
| [`spec.deployment`](/reference/deployment)     | Kubernetes / Cloud Run deployment manifests                  |

See the full field-by-field [Schema Reference](/reference/).

## Pinning v1 in downstream tools

Pin to a specific git tag inside `v1.x.y` rather than tracking `main`. The
schema file at any released tag is **immutable**, so a pin is a stable
contract.

```yaml
vars:
  ADL_SCHEMA_REF: v1.3.0
  ADL_SCHEMA_URL: https://raw.githubusercontent.com/inference-gateway/adl/{{.ADL_SCHEMA_REF}}/schema/v1/schema.json
```

New optional fields land as minor bumps inside `v1`; breaking changes wait
for `v2`. See [Versioning](/guide/versioning) for the additive contract and
the rules that govern what can change inside a major version.

## Resources

- [Schema JSON on GitHub](https://github.com/inference-gateway/adl/blob/main/schema/v1/schema.json)
- [Releases](https://github.com/inference-gateway/adl/releases)
- [Changelog](https://github.com/inference-gateway/adl/blob/main/CHANGELOG.md)
- [Examples](/examples/)
