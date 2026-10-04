# MCP-Connected Agent

[`spec.agent.mcp`](/reference/agent#mcp) configures how an agent uses
[MCP](https://modelcontextprotocol.io/) (Model Context Protocol):
`mcp.servers` lists the servers it connects to at runtime to discover and
call external tools, on top of its locally generated
[`spec.tools`](/reference/tools), and the surrounding fields tune the
client. It lives under `spec.agent` because it only makes sense once an
LLM is driving. This agent connects to two `http` servers - the only
transport the reference consumer wires today, see [What the reference
consumer wires](/guide/mcp#what-the-reference-consumer-wires).

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: devtools-agent
  description: Coding assistant that reaches external tools over MCP (http)
  version: "0.2.0"
  tags:
    - developer-tools
spec:
  capabilities:
    streaming: true
    pushNotifications: false

  agent:
    provider: openai
    model: gpt-4.1
    systemPrompt: |
      You are a coding assistant. Use the docs MCP server to look up
      references and the GitHub MCP server to inspect issues and PRs.
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
        - name: docs
          transport: http
          url: https://mcp.example.com/docs

  server:
    port: 8080

  language:
    go:
      module: github.com/example/devtools-agent
      version: "1.26"
```

## Highlights

- **`http` reaches a remote endpoint.** Both servers are addressed by
  `url`, and `github` carries an `Authorization` header. Placeholders
  like `${GITHUB_MCP_TOKEN}` are resolved by the consumer - the schema
  doesn't interpret them. See
  [Secrets & interpolation](/reference/secrets).
- **`http` is what gets wired today.** The schema also accepts `stdio`
  (`command`/`args`/`env`) and `sse`, but `adl-cli` drops those entries
  from `A2A_MCP_SERVERS` with a warning and generates the MCP client for
  Go agents only - see [What the reference consumer
  wires](/guide/mcp#what-the-reference-consumer-wires).
- **Only `name` + `transport` are required.** The remaining fields are
  the connection details for the chosen transport, and the schema doesn't
  enforce which combination is present, so consumers stay lenient.
- **MCP complements `spec.tools`.** Generated tools are deterministic
  entrypoints you own; MCP servers are external capabilities discovered
  at runtime. An agent can use either or both.
- **`mcp` turns the client on and sets the defaults.** `mcp.servers`
  lists the servers; the surrounding [`mcp`](/reference/agent#mcp) fields
  are the client runtime config. It is disabled by default - here
  `enabled: true` wires it in. Each field is the default for the matching
  `A2A_MCP_*` environment variable, which overrides it at runtime; the
  values shown are the built-in defaults, so this block is equivalent to
  just `enabled` plus `servers`. With `enabled: false` (or the block
  omitted) no MCP client is generated at all.
