# Connecting to MCP Servers

An agent's own [tools](/guide/tools-vs-skills) are the capabilities you
generate and own. **MCP** lets the same agent reach _out_ at runtime to
capabilities it doesn't own - a filesystem server, a GitHub server, an
internal service - and call them like any other tool. You declare that
under [`spec.agent.mcp`](/reference/agent#mcp).

## What MCP is, and why an agent connects out

[MCP](https://modelcontextprotocol.io/) (Model Context Protocol) is an open
protocol for exposing tools and context from a **server** to an LLM
**client**. ADL's generated agent ships with a built-in MCP client; point it
at one or more MCP servers and their tools become available to the model
alongside your [`spec.tools`](/reference/tools).

The two are complementary:

- **`spec.tools`** are deterministic entrypoints you define and generate
  into the project. You own the code.
- **MCP servers** are external capabilities discovered at runtime. You don't
  own them - you connect to them.

An agent can use either or both. Reach for MCP when the capability already
exists as a server (or someone else maintains it) and you'd rather connect
than reimplement.

`mcp` lives under `spec.agent` - not at the top of `spec` - because it only
makes sense once an LLM is driving the agent. It is the block that bridges an
[A2A](/guide/a2a) agent to the MCP ecosystem.

## The two sides: which servers, and how

The `mcp` block has two halves:

- **`mcp.servers`** - _which_ servers to connect to.
- **The surrounding client knobs** - _how_ to connect: the enable toggle,
  timeouts, refresh interval, and retry/backoff. These apply globally across
  every server (the built-in client is HTTP-single-endpoint, so there is no
  per-server override).

The client is **disabled by default**. `enabled` is required whenever the
`mcp` block is present, so turning it on is always explicit - omit the block
or set `enabled: false` and no MCP client is generated or wired in, even if
`servers` lists servers.

Every client knob maps 1:1 to an `A2A_MCP_*` environment variable. The value
in the manifest becomes the **default** the generated project emits (e.g. in
`.env.example`); the matching environment variable **overrides** it at
runtime.

| Field             | Env var                    | Default | What it controls                             |
| ----------------- | -------------------------- | ------- | -------------------------------------------- |
| `enabled`         | `A2A_MCP_ENABLE`           | `false` | Master switch - no client generated if off.  |
| `endpoint`        | `A2A_MCP_ENDPOINT`         | `/mcp`  | Path appended to each server URL.            |
| `refreshInterval` | `A2A_MCP_REFRESH_INTERVAL` | `5m`    | How often tools are re-discovered.           |
| `dialTimeout`     | `A2A_MCP_DIAL_TIMEOUT`     | `30s`   | Connection timeout.                          |
| `callTimeout`     | `A2A_MCP_CALL_TIMEOUT`     | `30s`   | Single tool-call timeout.                    |
| `maxRetries`      | `A2A_MCP_MAX_RETRIES`      | `0`     | Retries on failure (`0` = retry forever).    |
| `retryInterval`   | `A2A_MCP_RETRY_INTERVAL`   | `2s`    | Initial backoff between retries.             |
| `retryMaxInterval`| `A2A_MCP_RETRY_MAX_INTERVAL` | `30s` | Ceiling for the backoff.                     |

Interval and timeout fields are [Go duration
strings](https://pkg.go.dev/time#ParseDuration) (`5m`, `30s`, `1h30m`). Every
knob shown above is optional - set `enabled: true` plus `servers` and you get
the defaults. See [Reference: agent#mcp](/reference/agent#mcp) for the full
table.

## The three transports

Each entry in `mcp.servers` needs a `name` and a `transport`; the rest are
the connection details for that transport:

- **`stdio`** - launch a local subprocess (`command` + `args`, with optional
  `env`) and talk to it over stdin/stdout.
- **`http`** - reach a remote endpoint by `url`, with optional `headers`
  (e.g. an `Authorization` token).
- **`sse`** - a remote endpoint over Server-Sent Events, also addressed by
  `url` + `headers`.

```yaml
spec:
  agent:
    provider: openai
    model: gpt-4.1
    mcp:
      enabled: true
      servers:
        - name: filesystem # stdio: local subprocess
          transport: stdio
          command: npx
          args:
            - -y
            - "@modelcontextprotocol/server-filesystem"
            - /workspace
          env:
            LOG_LEVEL: info
        - name: github # http: remote endpoint
          transport: http
          url: https://mcp.example.com/github
          headers:
            Authorization: Bearer ${GITHUB_MCP_TOKEN}
```

Only `name` and `transport` are required; the schema does **not** enforce
which fields accompany a given transport, so consumers stay lenient.
Placeholders like `${GITHUB_MCP_TOKEN}` are resolved by the consumer, not the
schema - see [Secrets & interpolation](/reference/secrets) for where
credentials come from.

## Next steps

- [Reference: `spec.agent#mcp`](/reference/agent#mcp) - every `mcp` field and
  client knob, with types and defaults.
- [Example: MCP-Connected Agent](/examples/mcp) - a full manifest connecting
  over `stdio` and `http`.
- [Tools vs Skills](/guide/tools-vs-skills) - the capabilities an agent owns,
  which MCP complements.
- [Secrets & interpolation](/reference/secrets) - how `${...}` placeholders in
  headers and `env` are resolved.
