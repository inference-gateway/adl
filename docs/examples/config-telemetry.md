# Config, Telemetry & Artifacts

Three small operational blocks round out a manifest without describing
what the agent _does_: free-form runtime [`config`](/reference/config),
and the two on/off switches [`telemetry`](/reference/telemetry) and
[`artifacts`](/reference/artifacts). This agent turns on all three.

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
    metrics:
      exporter: prometheus
      prometheus:
        host: ""
        port: 9464
    traces:
      exporter: otlp
    otlp:
      endpoint: http://localhost:4318
      protocol: http/protobuf

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
- **`telemetry` selects an exporter per signal.** `enabled: true` pulls
  in OpenTelemetry and turns on the ADK telemetry server (maps to
  `A2A_TELEMETRY_ENABLE=true`); the optional `metrics`, `traces`, and
  `otlp` blocks then pick each signal's exporter (push vs pull) and the
  collector endpoint. Every field maps 1:1 to a standard `OTEL_*`
  environment variable and becomes a default in the generated
  `.env.example`; headers, credentials, and sampling stay runtime-only.
  `enabled` is the only required field, so `telemetry: { enabled: true }`
  on its own is still valid. See [`spec.telemetry`](/reference/telemetry).
- **`artifacts` is a single switch.** It exposes only an `enabled`
  boolean; `true` tells the generator to emit CI/CD wiring that produces
  build artifacts (container images, archives) - the consumer's pipeline
  decides what an artifact looks like. Like `telemetry`, it defaults to
  off, so omit it entirely if you don't need it. See
  [`spec.artifacts`](/reference/artifacts).
