# `spec.telemetry`

Configures [OpenTelemetry](https://opentelemetry.io/) instrumentation
for the generated agent. When enabled, the consumer (e.g. `adl-cli`)
pulls OpenTelemetry dependencies into the project, instruments the
built-in tool calls with spans so you can see how long each call takes,
and turns on the ADK's telemetry/metrics server so traces, metrics, and
logs can be exported.

Beyond the `enabled` master switch, three optional blocks - `metrics`,
`traces`, and `otlp` - select the per-signal exporter (push vs pull) and
the collector connection, following the
[OpenTelemetry SDK configuration](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/)
model. Every field maps 1:1 to a standard `OTEL_*` environment variable.

```yaml
spec:
  telemetry:
    enabled: true
    metrics:
      exporter: prometheus # prometheus | otlp | none
      prometheus:
        host: "" # empty binds all interfaces
        port: 9464
    traces:
      exporter: otlp # otlp | none
    otlp:
      endpoint: http://localhost:4318 # shared by every otlp signal
      protocol: http/protobuf # http/protobuf | grpc
```

Everything except `enabled` is optional, so the minimal form stays
valid and unchanged:

```yaml
spec:
  telemetry:
    enabled: true
```

## Fields

### `spec.telemetry`

| Field     | Type      | Required | Description                                                                                                             |
| --------- | --------- | :------: | ----------------------------------------------------------------------------------------------------------------------- |
| `enabled` | `boolean` |    ✓     | Master switch. When `true`, the generator wires in OpenTelemetry and turns on the ADK telemetry server. Off by default. |
| `metrics` | `object`  |          | Metrics-signal exporter selection. See [`metrics`](#spec-telemetry-metrics).                                            |
| `traces`  | `object`  |          | Traces-signal exporter selection. See [`traces`](#spec-telemetry-traces).                                               |
| `otlp`    | `object`  |          | OTLP collector connection shared by every signal whose exporter is `otlp`. See [`otlp`](#spec-telemetry-otlp).          |

### `spec.telemetry.metrics`

| Field        | Type     | Required | Description                                                                                                      |
| ------------ | -------- | :------: | ---------------------------------------------------------------------------------------------------------------- |
| `exporter`   | `string` |          | One of `prometheus` (pull endpoint), `otlp` (push to the collector), or `none`. Maps to `OTEL_METRICS_EXPORTER`. |
| `prometheus` | `object` |          | Bind address for the Prometheus scrape endpoint, used when `exporter: prometheus`.                               |

### `spec.telemetry.metrics.prometheus`

| Field  | Type      | Required | Description                                                                                                       |
| ------ | --------- | :------: | ----------------------------------------------------------------------------------------------------------------- |
| `host` | `string`  |          | Host/interface the endpoint binds to; empty string binds all interfaces. Maps to `OTEL_EXPORTER_PROMETHEUS_HOST`. |
| `port` | `integer` |          | TCP port the endpoint listens on (`1`-`65535`). Maps to `OTEL_EXPORTER_PROMETHEUS_PORT` (default `9464`).         |

### `spec.telemetry.traces`

| Field      | Type     | Required | Description                                                                      |
| ---------- | -------- | :------: | -------------------------------------------------------------------------------- |
| `exporter` | `string` |          | One of `otlp` (push to the collector) or `none`. Maps to `OTEL_TRACES_EXPORTER`. |

### `spec.telemetry.otlp`

| Field      | Type     | Required | Description                                                                                              |
| ---------- | -------- | :------: | -------------------------------------------------------------------------------------------------------- |
| `endpoint` | `string` |          | Base endpoint of the OTLP receiver, e.g. `http://localhost:4318`. Maps to `OTEL_EXPORTER_OTLP_ENDPOINT`. |
| `protocol` | `string` |          | Wire protocol: `http/protobuf` or `grpc`. Maps to `OTEL_EXPORTER_OTLP_PROTOCOL`.                         |

`spec.telemetry` itself is optional. Omit the block - or set
`enabled: false` - and telemetry stays off, which is the default. New
exporter and protocol values may be added in future minor versions, so
consumers should tolerate unknown enum values.

## How fields map to `OTEL_*`

Every field maps 1:1 to a standard OpenTelemetry environment variable.
`adl-cli` emits each as a default in the generated `.env.example`, and
the running agent reads the live `OTEL_*` variables - so a deployment can
override any of them without regenerating.

| Manifest field            | Environment variable            |
| ------------------------- | ------------------------------- |
| `metrics.exporter`        | `OTEL_METRICS_EXPORTER`         |
| `metrics.prometheus.host` | `OTEL_EXPORTER_PROMETHEUS_HOST` |
| `metrics.prometheus.port` | `OTEL_EXPORTER_PROMETHEUS_PORT` |
| `traces.exporter`         | `OTEL_TRACES_EXPORTER`          |
| `otlp.endpoint`           | `OTEL_EXPORTER_OTLP_ENDPOINT`   |
| `otlp.protocol`           | `OTEL_EXPORTER_OTLP_PROTOCOL`   |

## How `enabled` maps to the ADK

The generated agent runs on an Inference Gateway ADK, whose telemetry is
gated by `A2A_TELEMETRY_*` environment variables. Setting
`enabled: true` tells the consumer to switch the server's
`A2A_TELEMETRY_ENABLE` on; the ADK then exposes a metrics server and
honours the `OTEL_*` exporter configuration described above.

| Manifest         | ADK environment variable               |
| ---------------- | -------------------------------------- |
| `enabled: true`  | `A2A_TELEMETRY_ENABLE=true`            |
| `enabled: false` | `A2A_TELEMETRY_ENABLE=false` (default) |

## Manifest vs runtime

The manifest pins the **shape** of telemetry - which exporter each
signal uses and where the collector lives - because those are
architectural decisions that belong with the agent definition and become
sensible `.env.example` defaults. Everything that is sensitive or varies
per environment is deliberately left out and stays runtime-only:

- **Exporter headers and credentials** (`OTEL_EXPORTER_OTLP_HEADERS`,
  auth tokens) - secrets never belong in a manifest.
- **Sampling** (`OTEL_TRACES_SAMPLER`, `OTEL_TRACES_SAMPLER_ARG`) - tuned
  per environment against cost and traffic.

Set those directly through `OTEL_*` variables at deploy time. Additional
optional fields can be added in a future minor version without breaking
existing manifests.
