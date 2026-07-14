# Config, Telemetry & Artifacts

Three small operational blocks round out a manifest without describing
what the agent _does_: free-form runtime [`config`](/reference/config),
observability via [`telemetry`](/reference/telemetry), and the
[`artifacts`](/reference/artifacts) on/off switch. This agent turns on all
three.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: search-agent
  description: Catalogue search agent with runtime config and observability on
  version: "1.2.0"
  tags:
    - search
spec:
  capabilities:
    streaming: true
    pushNotifications: false
    stateTransitionHistory: false

  agent:
    provider: openai
    model: gpt-4.1-mini
    systemPrompt: |
      You answer questions by searching the product catalogue. Honour the
      cache and ranking settings provided in your runtime configuration.

  config:
    cache:
      ttlSeconds: 300
      maxEntries: 1000
    featureFlags:
      experimentalRanking: true
      semanticSearch: false
    search:
      provider: ${SEARCH_PROVIDER}
      endpoint: ${SEARCH_ENDPOINT}

  server:
    port: 8080

  language:
    go:
      module: github.com/example/search-agent
      version: "1.26"

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

  artifacts:
    enabled: true
```

## Highlights

- **`config` is grouped one level deep.** Every top-level key (`cache`,
  `featureFlags`, `search`) must itself be an _object_; inside that
  object, any JSON value goes: strings, numbers, booleans, nested
  objects. The generator passes the whole tree straight through to the
  agent's runtime config layer without interpreting it. See
  [`spec.config`](/reference/config#shape).
- **Secrets stay placeholders.** `config` accepts any value, which makes
  it a tempting place to paste an API key - don't. Reference secrets with
  `${VAR}` placeholders (`${SEARCH_PROVIDER}`, `${SEARCH_ENDPOINT}`) and
  let the consumer resolve them at runtime; the schema treats the
  placeholder as an opaque string. See
  [Secrets & interpolation](/reference/secrets).
- **`telemetry` starts with one switch, then opts into exporters.**
  `enabled: true` maps to `A2A_TELEMETRY_ENABLE=true` and turns on the ADK
  telemetry server. The optional `traces`/`metrics` blocks select a
  per-signal exporter - the single key under `exporter` picks it (`otlp`
  to push, `prometheus` to pull) - and every field maps 1:1 to a standard
  `OTEL_*` env var the consumer emits as an `.env.example` default.
  Headers, credentials, and sampling stay runtime-only. See
  [`spec.telemetry`](/reference/telemetry).
- **`artifacts` is the same shape.** Like `telemetry`, it exposes only an
  `enabled` boolean; `true` tells the generator to emit CI/CD wiring that
  produces build artifacts (container images, archives) - the consumer's
  pipeline decides what an artifact looks like. Both blocks default to
  off, so omit them entirely if you don't need them. See
  [`spec.artifacts`](/reference/artifacts).
