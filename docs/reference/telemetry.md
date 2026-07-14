# `spec.telemetry`

Configures [OpenTelemetry](https://opentelemetry.io/) instrumentation for
the generated agent. `enabled` is the master switch; the optional
`traces` and `metrics` blocks select a per-signal exporter following the
[OpenTelemetry SDK declarative-configuration](https://opentelemetry.io/docs/specs/otel/configuration/)
model.

When `enabled` is `true`, the consumer (e.g. `adl-cli`) pulls
OpenTelemetry dependencies into the project, instruments the built-in
tool calls with spans so you can see how long each call takes, and turns
on the ADK's telemetry/metrics server.

```yaml
spec:
  telemetry:
    enabled: true
    traces:
      exporter:
        otlp:
          endpoint: http://localhost:4318
          protocol: http/protobuf
    metrics:
      exporter:
        prometheus:
          host: ""
          port: 9464
```

## Shape

The exporter is nested **under each signal**, and the single key beneath
`exporter` selects it. There is no separate exporter enum and no
signal-agnostic protocol block.

- `traces.exporter` accepts `otlp`.
- `metrics.exporter` accepts `otlp` (push) or `prometheus` (pull).
- Exactly one exporter key is allowed per signal (enforced with `oneOf`).
- Omitting a signal - or its `exporter` block - disables that signal.

## Fields

### `spec.telemetry`

| Field     | Type      | Required | Description                                                                                |
| --------- | --------- | :------: | ------------------------------------------------------------------------------------------ |
| `enabled` | `boolean` |    ✓     | Master switch. `true` wires in OpenTelemetry and the ADK telemetry server. Off by default. |
| `traces`  | `object`  |          | Tracing (spans) signal configuration. Omit to disable tracing.                             |
| `metrics` | `object`  |          | Metrics signal configuration. Omit to disable metrics.                                     |

### `traces` / `metrics`

| Field      | Type     | Required | Description                                                        |
| ---------- | -------- | :------: | ------------------------------------------------------------------ |
| `exporter` | `object` |          | Selects the exporter. Exactly one key. Omit to disable the signal. |

### `exporter.otlp` (traces and metrics)

| Field      | Type     | Required | Description                                                          |
| ---------- | -------- | :------: | -------------------------------------------------------------------- |
| `endpoint` | `string` |          | Collector endpoint, e.g. `http://localhost:4318`. `${VAR}` accepted. |
| `protocol` | `string` |          | `http/protobuf` or `grpc`.                                           |

### `exporter.prometheus` (metrics only)

| Field  | Type      | Required | Description                                        |
| ------ | --------- | :------: | -------------------------------------------------- |
| `host` | `string`  |          | Host/interface the scrape endpoint binds to.       |
| `port` | `integer` |          | Scrape port (1-65535; OpenTelemetry default 9464). |

All fields except `enabled` are optional. Selecting `otlp: {}` with no
`endpoint`/`protocol` is valid - it turns the exporter on and leaves the
details to the standard OTLP environment defaults.

## Environment-variable mapping

Every manifest field maps 1:1 to a standard `OTEL_*` environment
variable, which `adl-cli` emits as a generated `.env.example` default.
The manifest fixes the field; the runtime always reads the env var, so an
operator can override any of these at deploy time.

| Manifest                       | Environment variable                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| `enabled: true`                | `A2A_TELEMETRY_ENABLE=true` (ADK master switch)                                          |
| `traces.exporter.otlp`         | `OTEL_TRACES_EXPORTER=otlp`                                                              |
| `metrics.exporter.otlp`        | `OTEL_METRICS_EXPORTER=otlp`                                                             |
| `metrics.exporter.prometheus`  | `OTEL_METRICS_EXPORTER=prometheus`                                                       |
| _signal omitted / no exporter_ | `OTEL_TRACES_EXPORTER=none` / `OTEL_METRICS_EXPORTER=none`                               |
| `otlp.endpoint`                | `OTEL_EXPORTER_OTLP_{TRACES,METRICS}_ENDPOINT` (or shared `OTEL_EXPORTER_OTLP_ENDPOINT`) |
| `otlp.protocol`                | `OTEL_EXPORTER_OTLP_{TRACES,METRICS}_PROTOCOL` (or shared `OTEL_EXPORTER_OTLP_PROTOCOL`) |
| `prometheus.host`              | `OTEL_EXPORTER_PROMETHEUS_HOST`                                                          |
| `prometheus.port`              | `OTEL_EXPORTER_PROMETHEUS_PORT`                                                          |

### Shared vs per-signal OTLP variables

When **both** signals use `otlp` with identical settings, the generator
may collapse them to the shared `OTEL_EXPORTER_OTLP_ENDPOINT` /
`OTEL_EXPORTER_OTLP_PROTOCOL`. When the two signals differ (or only one
uses OTLP), it emits the per-signal `OTEL_EXPORTER_OTLP_TRACES_*` /
`OTEL_EXPORTER_OTLP_METRICS_*` variants instead.

## What stays out of the manifest

Headers, credentials/authentication, and sampling are deliberately **not**
manifest fields. They are secrets or per-environment tuning that belong in
the runtime environment, supplied through the standard variables
(`OTEL_EXPORTER_OTLP_HEADERS`, `OTEL_TRACES_SAMPLER`,
`OTEL_TRACES_SAMPLER_ARG`, ...). Keeping them env-only avoids baking
secrets or environment-specific values into a portable manifest. See
[Secrets & interpolation](./secrets).

## Backwards compatibility

`traces` and `metrics` are optional additions; `enabled` is unchanged and
still the only required field. An existing manifest with just
`telemetry: { enabled: true }` continues to validate and behaves exactly
as before.
