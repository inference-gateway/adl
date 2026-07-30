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
    supportsExtendedAgentCard: true
    securitySchemes:
      apiKey:
        type: apiKey
        name: X-API-Key
        in: header
      bearer:
        type: http
        scheme: Bearer
        bearerFormat: JWT
    security:
      - apiKey: []
      - bearer: []
```

## Fields

| Field                       | Type       | Description                                                                   |
| --------------------------- | ---------- | ----------------------------------------------------------------------------- |
| `protocolVersion`           | `string`   | The agent-protocol version the deployed instance speaks.                      |
| `url`                       | `string`   | Where the deployed agent lives.                                               |
| `preferredTransport`        | `string`   | The transport the agent prefers (e.g. `http+sse`, `grpc`).                    |
| `defaultInputModes`         | `string[]` | Media types the agent accepts by default.                                     |
| `defaultOutputModes`        | `string[]` | Media types the agent returns by default.                                     |
| `documentationUrl`          | `string`   | Human-readable documentation for the agent.                                   |
| `iconUrl`                   | `string`   | Display icon for registries and UIs.                                          |
| `supportsExtendedAgentCard` | `boolean`  | Serve a richer card via `agent/getAuthenticatedExtendedCard` (A2A section 7). |
| `securitySchemes`           | `object`   | Statically declared security schemes, keyed by name.                          |
| `security`                  | `object[]` | Security requirements referencing `securitySchemes`.                          |

All fields are optional. If you don't surface a public card, omit the
block entirely - it's purely declarative.

## Card-driven authentication (A2A section 7)

`supportsExtendedAgentCard`, `securitySchemes`, and `security` express
[A2A authentication](https://a2a-protocol.org/latest/specification/#7-authentication-and-authorization)
on the AgentCard.

`securitySchemes` follows the A2A/OpenAPI `SecurityScheme` shape. Only
statically declarable schemes belong here - schemes that cannot be derived
from runtime config:

| `type`      | Fields                                                |
| ----------- | ----------------------------------------------------- |
| `apiKey`    | `name` (param name), `in` (`header`/`query`/`cookie`) |
| `http`      | `scheme` (e.g. `Bearer`, `Basic`), `bearerFormat`     |
| `mutualTLS` | (client-certificate auth; description only)           |

`security` is a list of requirement objects mapping a scheme name to its
required scopes (empty for scopeless schemes). Keys within one entry are
ANDed; separate entries are ORed.

OIDC/OAuth2 schemes are **not** declared here: they are runtime concerns
(`AUTH_ISSUER_URL` / `AUTH_CLIENT_ID` / `AUTH_CLIENT_SECRET`), and the ADK
derives their scheme declaration at startup - baking an issuer into the
manifest would be wrong per environment.
