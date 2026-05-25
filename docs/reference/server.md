# `spec.server`

Runtime HTTP server configuration. The only **required** field is
`port`; the rest tune transport and auth.

```yaml
spec:
  server:
    port: 8080
    scheme: https
    debug: false
    auth:
      enabled: true
```

## Fields

| Field    | Type      | Required | Constraint                   | Description                                                       |
|----------|-----------|:--------:|------------------------------|-------------------------------------------------------------------|
| `port`   | `integer` |    ✓     | `1` ≤ port ≤ `65535`         | TCP port the server binds to.                                     |
| `scheme` | `string`  |          | —                            | URL scheme (`http`, `https`). Influences emitted URLs in code.    |
| `debug`  | `boolean` |          | —                            | Enable verbose debug logging in generated code.                   |
| `auth`   | `object`  |          | see [Auth](#spec-server-auth) | Authentication block.                                            |

## `spec.server.auth` {#spec-server-auth}

```yaml
spec:
  server:
    auth:
      enabled: true
```

| Field     | Type      | Required | Description                                                                                    |
|-----------|-----------|:--------:|------------------------------------------------------------------------------------------------|
| `enabled` | `boolean` |          | If `true`, the generator wires authentication into the server pipeline; if `false` or omitted, the server is open. |

The schema deliberately keeps `auth` minimal in v1: it carries the
intent (auth on / off), and the concrete mechanism (JWT, OIDC, mTLS,
etc.) is the generator's territory. Future minor versions may extend
this block with typed sub-configs as patterns stabilise across
consumers.
