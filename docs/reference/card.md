# `spec.card`

Optional protocol-card metadata. Surfaces information consumers need to
_talk to_ the deployed agent - protocol version, endpoint URL, supported
input/output modes, and documentation links.

These fields populate the [A2A](/guide/a2a) `AgentCard` the generator
serves at `/.well-known/agent-card.json`. See
[A2A & the Agent Card](/guide/a2a) for the full ADL → `AgentCard` mapping.

```yaml
spec:
  card:
    protocolVersion: "1.0"
    url: https://agents.acme.example/customer-support
    preferredTransport: http+sse
    defaultInputModes:
      - text/plain
      - application/json
    defaultOutputModes:
      - text/plain
    documentationUrl: https://acme.example/docs/customer-support
    iconUrl: https://acme.example/agents/customer-support.png
```

## Fields

| Field                | Type       | Description                                                |
| -------------------- | ---------- | ---------------------------------------------------------- |
| `protocolVersion`    | `string`   | The agent-protocol version the deployed instance speaks.   |
| `url`                | `string`   | Where the deployed agent lives.                            |
| `preferredTransport` | `string`   | The transport the agent prefers (e.g. `http+sse`, `grpc`). |
| `defaultInputModes`  | `string[]` | Media types the agent accepts by default.                  |
| `defaultOutputModes` | `string[]` | Media types the agent returns by default.                  |
| `documentationUrl`   | `string`   | Human-readable documentation for the agent.                |
| `iconUrl`            | `string`   | Display icon for registries and UIs.                       |

All fields are optional. If you don't surface a public card, omit the
block entirely - it's purely declarative.
