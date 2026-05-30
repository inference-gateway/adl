# `spec.agent`

LLM-side configuration: which provider, which model, the system prompt,
standard sampling knobs, and any [MCP servers](#mcps) the agent connects
to.

The whole block is **optional**. A2A does not require an LLM, so an agent
can ship without one - just omit `spec.agent` entirely. Everything inside
it is optional too, so a bare `agent: {}` is also valid.

```yaml
spec:
  agent:
    provider: deepseek
    model: deepseek-v4-flash
    systemPrompt: |
      You are a professional customer support agent.
    maxTokens: 4096
    temperature: 0.3
    mcps:
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
  `google`, `mistral`, `groq`.

The provider behind the LLM. The empty string is allowed for manifests
that defer provider selection to deploy time.

New providers may be added in future **minor** schema versions. Consumers
should be lenient about unknown values when reading newer manifests.

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

## `mcps`

- **Type:** `array` of MCP server objects
- **Required:** no

[MCP](https://modelcontextprotocol.io/) (Model Context Protocol) servers
the agent connects to at runtime to discover and call external tools and
capabilities, on top of the locally generated [`spec.tools`](./tools).
This is what bridges an A2A agent to the MCP ecosystem. It lives under
`spec.agent` - rather than at the top of `spec` - because it only makes
sense once an LLM is driving the agent.

Each entry takes:

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
    mcps:
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
placeholders such as `${GITHUB_MCP_TOKEN}`. New `transport` values may be
added in future **minor** schema versions; consumers should tolerate
unknown values when reading newer manifests.
