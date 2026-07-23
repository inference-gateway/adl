# `spec.agent`

LLM-side configuration: which provider, which model, the system prompt,
standard sampling knobs, and the [MCP](#mcp) servers and client the agent
connects with.

The whole block is **optional**. [A2A](/guide/a2a) does not require an LLM,
so an agent can ship without one - just omit `spec.agent` entirely.
Everything inside it is optional too, so a bare `agent: {}` is also valid.

```yaml
spec:
  agent:
    provider: deepseek
    model: deepseek-v4-flash
    systemPrompt: |
      You are a professional customer support agent.
    maxTokens: 4096
    temperature: 0.3
    mcp:
      enabled: true
      servers:
        - name: filesystem
          transport: stdio
          command: npx
          args:
            - -y
            - "@modelcontextprotocol/server-filesystem"
            - /workspace
        - name: github
          transport: http
          url: https://mcp.example.com/github
          headers:
            Authorization: Bearer ${GITHUB_MCP_TOKEN}
```

## `provider`

- **Type:** `string`
- **Required:** no
- **Allowed values:** `""`, `openai`, `anthropic`, `ollama`, `deepseek`,
  `google`, `mistral`, `groq`, `cohere`, `cloudflare`, `moonshot`,
  `ollama_cloud`, `nvidia`, `minimax`.

The provider behind the LLM. The empty string is allowed for manifests
that defer provider selection to deploy time.

New providers may be added in future **minor** schema versions. Consumers
should be lenient about unknown values when reading newer manifests.

There is no API-key field here. `provider` and `model` select _which_
LLM to use; the credential is injected at runtime as an environment
variable by the generated project, never stored in the manifest. See
[Secrets & interpolation](./secrets).

## `model`

- **Type:** `string`
- **Required:** no

The model identifier for the chosen provider (e.g. `gpt-4o-mini`,
`claude-sonnet-4-7`, `deepseek-v4-flash`). The schema doesn't constrain
the value - providers move fast, and the model catalogue is consumer
territory.

## `systemPrompt`

- **Type:** `string`
- **Required:** no

The system prompt the agent boots with. Skills (see
[`spec.skills`](./skills)) are injected on top of this prompt at
startup, so keep `systemPrompt` focused on identity and ground rules,
and put workflows into skills.

## `maxTokens`

- **Type:** `integer`
- **Required:** no
- **Minimum:** `1`

Upper bound on tokens the model may emit per response. Optional - many
runtimes default to a provider-specific value when omitted.

## `temperature`

- **Type:** `number`
- **Required:** no
- **Minimum:** `0`
- **Maximum:** `2`

Sampling temperature. `0` makes the model maximally deterministic, `2`
maximally creative. The clamp matches what most providers actually
accept.

## `mcp`

- **Type:** `object`
- **Required:** no

[MCP](https://modelcontextprotocol.io/) (Model Context Protocol)
configuration for the agent: the servers it connects to plus the runtime
settings for its built-in MCP client. This is what bridges an A2A agent
to the MCP ecosystem. It lives under `spec.agent` - rather than at the
top of `spec` - because it only makes sense once an LLM is driving the
agent.

`mcp.servers` declares _which_ servers to connect to; the surrounding
fields are the _how_: the enable toggle plus the connection, refresh, and
retry knobs, applied globally across those servers. The MCP client is
**disabled by default** - omit this block or set `enabled: false` and no
MCP client is wired in (and no MCP code is generated), even if `servers`
lists servers.

`enabled` is `required` when the `mcp` block is present, so the intent to
turn the client on or off is always explicit.

### `mcp.servers`

- **Type:** `array` of MCP server objects
- **Required:** no

The MCP servers the agent connects to at runtime to discover and call
external tools and capabilities, on top of the locally generated
[`spec.tools`](./tools). Each entry takes:

- `name` - **required** `string`. Identifier, unique within the agent.
  Pattern `^[a-zA-Z0-9_-]+$`.
- `transport` - **required** `string`. One of `stdio`, `sse`, `http`.
- `command` - `string`. Executable to launch for a `stdio` server (e.g.
  `npx`, `uvx`, `docker`).
- `args` - `string[]`. Arguments passed to `command` for a `stdio`
  server.
- `env` - `map[string]string`. Environment variables for a `stdio`
  server (e.g. API keys it needs).
- `url` - `string`. Endpoint URL for an `http` or `sse` server.
- `headers` - `map[string]string`. Extra HTTP headers for an `http` or
  `sse` server (e.g. an `Authorization` header).

```yaml
spec:
  agent:
    provider: openai
    model: gpt-4.1
    mcp:
      enabled: true
      servers:
        - name: filesystem
          transport: stdio
          command: npx
          args:
            - -y
            - "@modelcontextprotocol/server-filesystem"
            - /workspace
          env:
            LOG_LEVEL: info
        - name: github
          transport: http
          url: https://mcp.example.com/github
          headers:
            Authorization: Bearer ${GITHUB_MCP_TOKEN}
```

Only `name` and `transport` are required; the remaining fields are the
connection details for the chosen transport. The schema intentionally
does **not** enforce which combination is present for a given transport,
so consumers stay lenient and decide how to resolve environment
placeholders such as `${GITHUB_MCP_TOKEN}` - see
[Secrets & interpolation](./secrets) for the convention and where
credentials come from. New `transport` values may be added in future
**minor** schema versions; consumers should tolerate unknown values when
reading newer manifests.

### Client runtime config

Alongside `servers`, the `mcp` block carries the runtime configuration
for the built-in MCP client. Every field maps 1:1 to an `A2A_MCP_*`
environment variable the generated agent reads, and its value here
becomes the **default** the generated project emits (e.g. in
`.env.example`); the matching environment variable **overrides** it at
runtime. The list of server base URLs the client connects to
(`A2A_MCP_SERVERS`) is derived from the `servers` entries, not set here.

The client models the Go ADK's connection/retry config, which is
HTTP-only with a single endpoint and one timeout/retry set - there is no
per-server override, which is why these knobs live once on the `mcp`
block rather than on each `servers` entry.

| Field              | Env var                      | Type      | Default | Meaning                                                            |
| ------------------ | ---------------------------- | --------- | ------- | ------------------------------------------------------------------ |
| `enabled`          | `A2A_MCP_ENABLE`             | `boolean` | `false` | Master switch. When false, no MCP client is generated or wired in. |
| `endpoint`         | `A2A_MCP_ENDPOINT`           | `string`  | `/mcp`  | Path appended to each server base URL to reach its MCP endpoint.   |
| `refreshInterval`  | `A2A_MCP_REFRESH_INTERVAL`   | `string`  | `5m`    | How often the client re-discovers the tools each server exposes.   |
| `dialTimeout`      | `A2A_MCP_DIAL_TIMEOUT`       | `string`  | `30s`   | Timeout for establishing a connection to a server.                 |
| `callTimeout`      | `A2A_MCP_CALL_TIMEOUT`       | `string`  | `30s`   | Timeout for a single MCP tool call.                                |
| `maxRetries`       | `A2A_MCP_MAX_RETRIES`        | `integer` | `0`     | Max retries for a failed operation. `0` means retry forever.       |
| `retryInterval`    | `A2A_MCP_RETRY_INTERVAL`     | `string`  | `2s`    | Initial backoff between retries.                                   |
| `retryMaxInterval` | `A2A_MCP_RETRY_MAX_INTERVAL` | `string`  | `30s`   | Maximum backoff between retries once the interval has grown.       |

The interval and timeout fields are [Go duration
strings](https://pkg.go.dev/time#ParseDuration) (e.g. `5m`, `30s`,
`1h30m`); the schema keeps them as free-form strings and does not
validate the duration syntax.

```yaml
spec:
  agent:
    provider: openai
    model: gpt-4.1
    mcp:
      enabled: true
      endpoint: /mcp
      refreshInterval: 5m
      dialTimeout: 30s
      callTimeout: 30s
      maxRetries: 0
      retryInterval: 2s
      retryMaxInterval: 30s
      servers:
        - name: github
          transport: http
          url: https://mcp.example.com/github
          headers:
            Authorization: Bearer ${GITHUB_MCP_TOKEN}
```
