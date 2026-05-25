# `spec.artifacts`

Toggles generation of build artifacts for the agent project (e.g.
container images, archives) by the consumer's CD pipeline. The schema
intentionally exposes only the on/off switch; downstream consumers
decide what an "artifact" looks like.

```yaml
spec:
  artifacts:
    enabled: true
```

## Fields

| Field     | Type      | Required | Description                                                            |
| --------- | --------- | :------: | ---------------------------------------------------------------------- |
| `enabled` | `boolean` |    ✓     | When `true`, the generator emits CI/CD wiring that produces artifacts. |

## Why so minimal?

Artifact production is highly consumer-specific — image registries,
release naming conventions, signing, attestation. Pinning that down in
v1 of the schema would lock manifests to whatever was popular at the
time. The single boolean keeps the contract durable while delegating
the details.
