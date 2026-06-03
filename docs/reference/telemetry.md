# `spec.telemetry`

Toggles [OpenTelemetry](https://opentelemetry.io/) instrumentation for
the generated agent. When enabled, the consumer (e.g. `adl-cli`) pulls
OpenTelemetry dependencies into the project, instruments the built-in
tool calls with spans so you can see how long each call takes, and turns
on the ADK's telemetry/metrics server so traces, metrics, and logs can
be exported.

```yaml
spec:
  telemetry:
    enabled: true
```

## Fields

| Field     | Type      | Required | Description                                                                                      |
| --------- | --------- | :------: | ------------------------------------------------------------------------------------------------ |
| `enabled` | `boolean` |    ✓     | When `true`, the generator wires in OpenTelemetry and the ADK telemetry server. Defaults to off. |

`spec.telemetry` itself is optional. Omit the block - or set
`enabled: false` - and telemetry stays off, which is the default.

## How it maps to the ADK

The generated agent runs on an Inference Gateway ADK, whose telemetry is
driven by `A2A_TELEMETRY_*` environment variables. Setting
`enabled: true` tells the consumer to switch the server's
`A2A_TELEMETRY_ENABLE` on; the ADK then exposes a metrics server (by
default on `A2A_TELEMETRY_METRICS_PORT`, `9090`) for scraping or export.

| Manifest         | ADK environment variable               |
| ---------------- | -------------------------------------- |
| `enabled: true`  | `A2A_TELEMETRY_ENABLE=true`            |
| `enabled: false` | `A2A_TELEMETRY_ENABLE=false` (default) |

## Why so minimal?

Like [`spec.artifacts`](./artifacts), the schema exposes only the on/off
switch. The exporter endpoint, metrics port, sampling strategy, and
resource attributes are deployment concerns that differ per environment
and are better resolved at runtime (through the ADK's `A2A_TELEMETRY_*`
variables) than pinned into the manifest. Keeping the contract to a
single boolean lets it stay durable while the consumer and the runtime
own the details. Additional optional fields can be added in a future
minor version without breaking existing manifests.
