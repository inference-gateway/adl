# Observability

ADL agents ship with [OpenTelemetry](https://opentelemetry.io/) instrumentation
out of the box. You declare it in the manifest - like everything else - and the
generator wires in the SDK, instruments tool calls with spans, and turns on the
ADK telemetry server. No post-deploy config, no sidecar to bolt on.

## Why observability lives in the manifest

A manifest describes what the agent _is_ and _needs_ to run. Telemetry is a
runtime need: the agent emits traces and metrics to a collector or a Prometheus
scrape endpoint, and that destination is part of the agent's contract with its
operating environment. Putting it in the manifest means the generated project
arrives with the right wiring - env-var defaults, dependency pulls, and
instrumentation hooks - instead of relying on an operator to remember to add
them after deploy.

## Per-signal model

`spec.telemetry` has a master switch (`enabled`) and two optional signal blocks:

- **`traces`** - distributed tracing spans. Exporter: `otlp` only.
- **`metrics`** - metric data points. Exporter: `otlp` (push) or `prometheus`
  (pull).

Exactly one exporter key is allowed per signal. Omit a signal block (or its
`exporter`) and that signal is disabled - the generator emits
`A2A_OTEL_TRACES_EXPORTER=none` or `A2A_OTEL_METRICS_EXPORTER=none`.

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

Every field maps 1:1 to a standard `OTEL_*` environment variable, which
`adl-cli` writes with an `A2A_` prefix (`A2A_OTEL_TRACES_EXPORTER`,
`A2A_OTEL_EXPORTER_OTLP_ENDPOINT`, ...) because the ADK reads its whole
configuration under that prefix. The manifest fixes the field; the runtime
reads the env var, so an operator can override any value at deploy time without
touching the manifest.

## What the generated agent emits

With `telemetry.enabled: true` the consumer (e.g. `adl-cli`):

- Pulls OpenTelemetry dependencies into the project.
- Instruments every built-in tool call with spans - you see how long each call
  takes in your trace visualizer.
- Turns on the ADK telemetry/metrics server.
- Emits the matching `A2A_OTEL_*` defaults into `.env.example` - but only when
  `spec.development.sandbox.dockerCompose.enabled: true`, which is the sole
  trigger for generating that file at all.

Language differences worth knowing: Go always collapses OTLP to the shared
`A2A_OTEL_EXPORTER_OTLP_ENDPOINT` / `_PROTOCOL` pair, TypeScript uses the
per-signal `_TRACES_` / `_METRICS_` names unless both signals share an endpoint
and protocol, `prometheus` host/port variables are emitted for Go only, and
Rust projects get no telemetry variables yet. See the
[`spec.telemetry` reference](/reference/telemetry#shared-vs-per-signal-otlp-variables).

Headers, credentials, and sampling stay out of the manifest - they are secrets
or per-environment tuning that belong in the runtime environment through the
standard `OTEL_EXPORTER_OTLP_HEADERS`, `OTEL_TRACES_SAMPLER`, and similar
variables. See [Secrets & interpolation](/reference/secrets).

## Next steps

- [`spec.telemetry`](/reference/telemetry) - every field, type, and env-var
  mapping.
- [Config, Telemetry & Artifacts](/examples/config-telemetry) - a full manifest
  with telemetry on.
- [Secrets & interpolation](/reference/secrets) - how `${...}` placeholders and
  env-var overrides work.
