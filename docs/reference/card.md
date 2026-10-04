# `spec.card`

Optional protocol-card metadata. Surfaces information consumers need to
_talk to_ the deployed agent - endpoint URLs, protocol versions and
bindings, supported input/output modes, and documentation links.

These fields populate the [A2A](/guide/a2a) `AgentCard` the generator
serves at `/.well-known/agent-card.json`. See
[A2A & the Agent Card](/guide/a2a) for the full ADL → `AgentCard` mapping.

```yaml
spec:
  card:
    supportedInterfaces:
      - url: https://agents.acme.example/customer-support
        protocolBinding: JSONRPC
        protocolVersion: "1.0"
    defaultInputModes:
      - text/plain
      - application/json
    defaultOutputModes:
      - text/plain
    documentationUrl: https://acme.example/docs/customer-support
    iconUrl: https://acme.example/agents/customer-support.png
    securitySchemes:
      apiKey:
        type: apiKey
        name: X-API-Key
        in: header
      bearer:
        type: http
        scheme: Bearer
        bearerFormat: JWT
    securityRequirements:
      - apiKey: []
      - bearer: []
```

## Fields

| Field                  | Type       | Description                                                                                                                                                                                   |
| ---------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supportedInterfaces`  | `object[]` | Ordered list of protocol endpoints - the first entry is the preferred one (A2A v1.0.1). Each entry requires `url`, `protocolBinding` (an open string, core values `JSONRPC`, `GRPC` and `HTTP+JSON`) and `protocolVersion`. |
| `defaultInputModes`    | `string[]` | Media types the agent accepts by default.                                                                                                                                                     |
| `defaultOutputModes`   | `string[]` | Media types the agent returns by default.                                                                                                                                                     |
| `documentationUrl`     | `string`   | Human-readable documentation for the agent.                                                                                                                                                   |
| `iconUrl`              | `string`   | Display icon for registries and UIs.                                                                                                                                                          |
| `securitySchemes`      | `object`   | Statically declared security schemes, keyed by name.                                                                                                                                          |
| `securityRequirements` | `object[]` | Security requirements referencing `securitySchemes` (the v1.0.1 field name).                                                                                                                  |

All fields are optional. If you don't surface a public card, omit the
block entirely - it's purely declarative. (On the wire, A2A v1.0.1
requires `supportedInterfaces`; ADL keeps it optional here so consumers
can derive the endpoint from [`spec.server`](/reference/server).)

## Card-driven authentication (A2A section 7)

`securitySchemes` and `securityRequirements` express
[A2A authentication](https://a2a-protocol.org/latest/specification/#7-authentication-and-authorization)
on the AgentCard; the extended card is declared via
[`capabilities.extendedAgentCard`](/reference/capabilities).

`securitySchemes` is authored in a flat, OpenAPI-3.0-style form (a `type`
discriminator with sibling fields). Consumers (e.g. adl-cli) map it onto the
ADK's A2A `SecurityScheme` wrapper (`type` -> the wrapper key,
`in` -> `location`). Only statically declarable schemes belong here - schemes
that cannot be derived from runtime config:

| `type`      | Fields                                                |
| ----------- | ----------------------------------------------------- |
| `apiKey`    | `name` (param name), `in` (`header`/`query`/`cookie`) |
| `http`      | `scheme` (e.g. `Bearer`, `Basic`), `bearerFormat`     |
| `mutualTLS` | (client-certificate auth; description only)           |

`securityRequirements` is a list of requirement objects mapping a scheme
name to its required scopes (empty for scope-less schemes). Keys within
one entry are ANDed; separate entries are ORed. This flat form is also
the A2A v1.0.1 wire form (`AgentCard.securityRequirements`), so the
generated card emits it verbatim.

OIDC/OAuth2 schemes are **not** declared here - including every OAuth
flow the v1.0.1 `SecurityScheme` knows (`authorizationCode`, `implicit`,
`password`, `clientCredentials`) and the newer `deviceCode` flow
(`DeviceCodeOAuthFlow`). They are runtime concerns (`AUTH_ISSUER_URL` /
`AUTH_CLIENT_ID` / `AUTH_CLIENT_SECRET`), and the ADK derives their
scheme declaration at startup - baking an issuer into the manifest would
be wrong per environment.
