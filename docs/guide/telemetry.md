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
arrives with the right wiring - `.env.example` defaults, dependency pulls, and
instrumentation hooks - instead of relying on an operator to remember to add
them after deploy.

## Per-signal model

`spec.telemetry` has a master switch (`enabled`) and two optional signal blocks:

- **`traces`** - distributed tracing spans. Exporter: `otlp` only.
- **`metrics`** - metric data points. Exporter: `otlp` (push) or `prometheus`
  (pull).

Exactly one exporter key is allowed per signal. Omit a signal block (or its
`exporter`) and that signal is disabled - the generator emits
`OTEL_TRACES_EXPORTER=none` or `OTEL_METRICS_EXPORTER=none`.

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

Every field maps 1:1 to a standard `OTEL_*` environment variable the generator
emits as an `.env.example` default. The manifest fixes the field; the runtime
reads the env var, so an operator can override any value at deploy time without
touching the manifest.

## What the generated agent emits

With `telemetry.enabled: true` the consumer (e.g. `adl-cli`):

- Pulls OpenTelemetry dependencies into the project.
- Instruments every built-in tool call with spans - you see how long each call
  takes in your trace visualizer.
- Turns on the ADK telemetry/metrics server.
- Emits `.env.example` with the matching `OTEL_*` defaults.

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
