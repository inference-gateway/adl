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
    authz:
      enabled: true
      mode: custom
```

## Fields

| Field    | Type      | Required | Constraint                      | Description                                                    |
| -------- | --------- | :------: | ------------------------------- | -------------------------------------------------------------- |
| `port`   | `integer` |    ✓     | `1` ≤ port ≤ `65535`            | TCP port the server binds to.                                  |
| `scheme` | `string`  |          | -                               | URL scheme (`http`, `https`). Influences emitted URLs in code. |
| `debug`  | `boolean` |          | -                               | Enable verbose debug logging in generated code.                |
| `auth`   | `object`  |          | see [Auth](#spec-server-auth)   | Authentication block (who the caller is).                      |
| `authz`  | `object`  |          | see [Authz](#spec-server-authz) | Authorization block (what the caller may do).                  |

## `spec.server.auth` {#spec-server-auth}

```yaml
spec:
  server:
    auth:
      enabled: true
```

| Field     | Type      | Required | Description                                                                                                        |
| --------- | --------- | :------: | ------------------------------------------------------------------------------------------------------------------ |
| `enabled` | `boolean` |          | If `true`, the generator wires authentication into the server pipeline; if `false` or omitted, the server is open. |

The schema deliberately keeps `auth` minimal in v1: it carries the
intent (auth on / off), and the concrete mechanism (JWT, OIDC, mTLS,
etc.) is the generator's territory. Future minor versions may extend
this block with typed sub-configs as patterns stabilise across
consumers.

## `spec.server.authz` {#spec-server-authz}

```yaml
spec:
  server:
    authz:
      enabled: true
      mode: deny-all
```

| Field     | Type      | Required | Description                                                                                                                                                      |
| --------- | --------- | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled` | `boolean` |          | Master switch. When `true`, the generated project scaffolds a user-owned `BeforeTool` authorization callback. Off by default.                                    |
| `mode`    | `string`  |          | Default policy until you write custom logic: `allow-all` (permit everything), `deny-all` (reject everything), `custom` (your own code). Defaults to `allow-all`. |

Both fields are optional. When `authz` is omitted entirely, no callback
is scaffolded and the effective mode is `allow-all`.

`auth` and `authz` answer different questions: `auth` is
**authentication** - establishing _who_ the caller is - while `authz` is
**authorization** - deciding _what_ that caller is allowed to invoke. The
scaffolded `BeforeTool` callback runs per tool call, so it is the hook
where you gate individual tools on the authenticated identity. Enabling
one does not enable the other.
