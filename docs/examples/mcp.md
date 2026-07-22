# MCP-Connected Agent

[`spec.agent.mcps`](/reference/agent#mcps) lists the
[MCP](https://modelcontextprotocol.io/) (Model Context Protocol) servers
an agent connects to at runtime to discover and call external tools, on
top of its locally generated [`spec.tools`](/reference/tools). It lives
under `spec.agent` because it only makes sense once an LLM is driving.
This agent connects to two servers over two different transports.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: devtools-agent
  description: Coding assistant that reaches external tools over MCP (stdio + http)
  version: "0.2.0"
  tags:
    - developer-tools
spec:
  capabilities:
    streaming: true
    pushNotifications: false
    stateTransitionHistory: true

  agent:
    provider: openai
    model: gpt-4.1
    systemPrompt: |
      You are a coding assistant. Use the filesystem MCP server to read
      local files and the GitHub MCP server to inspect issues and PRs.
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
    mcp:
      enabled: true
      endpoint: /mcp
      refreshInterval: 5m
      dialTimeout: 30s
      callTimeout: 30s
      maxRetries: 0
      retryInterval: 2s
      retryMaxInterval: 30s

  server:
    port: 8080

  language:
    go:
      module: github.com/example/devtools-agent
      version: "1.26"
```

## Highlights

- **`stdio` launches a local subprocess.** `filesystem` is started with
  `command` + `args` (here `npx ... server-filesystem /workspace`) and
  the agent talks to it over stdin/stdout. `env` sets variables the
  subprocess needs.
- **`http` reaches a remote endpoint.** `github` is a remote server
  addressed by `url`, with `headers` carrying an `Authorization` token.
  Placeholders like `${GITHUB_MCP_TOKEN}` are resolved by the consumer -
  the schema doesn't interpret them. See
  [Secrets & interpolation](/reference/secrets).
- **Only `name` + `transport` are required.** The remaining fields are
  the connection details for the chosen transport; the schema doesn't
  enforce which combination is present, so consumers stay lenient.
  (`sse` is the third accepted transport.)
- **MCP complements `spec.tools`.** Generated tools are deterministic
  entrypoints you own; MCP servers are external capabilities discovered
  at runtime. An agent can use either or both.
- **`mcp` turns the client on and sets the defaults.** `mcps` lists the
  servers; the sibling [`mcp`](/reference/agent#mcp) block is the client
  runtime config. It is disabled by default - here `enabled: true` wires
  it in. Each field is the default for the matching `A2A_MCP_*`
  environment variable, which overrides it at runtime; the values shown
  are the built-in defaults, so this block is equivalent to just
  `enabled: true`. With `enabled: false` (or the block omitted) no MCP
  client is generated at all.
