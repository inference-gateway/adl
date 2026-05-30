# Customer Support Agent

A realistic manifest with most of the optional blocks turned on:
provider/model selection, MCP servers, tools, skills, services, a flox
sandbox with Claude Code provisioned, and CD targeting Cloud Run.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: customer-support
  description: AI agent for handling customer inquiries
  version: "1.0.0"
  author:
    name: Acme Corp
    email: agents@acme.example
    url: https://acme.example
  license: Apache-2.0
  tags:
    - support
    - customer-service
spec:
  capabilities:
    streaming: true
    pushNotifications: true
    stateTransitionHistory: true

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

  agent:
    provider: deepseek
    model: deepseek-v4-flash
    systemPrompt: |
      You are a professional customer support agent for Acme Corp.
      Be concise, empathetic, and accurate. Escalate via the
      `escalate_ticket` tool when you can't resolve an issue.
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
      - name: docs
        transport: http
        url: https://mcp.acme.example/docs
        headers:
          Authorization: Bearer ${DOCS_MCP_TOKEN}

  services:
    customerRepo:
      type: repository
      interface: CustomerRepository
      factory: NewPostgresCustomerRepository
      description: Customer lookup by ID, backed by Postgres.
    ticketingClient:
      type: client
      interface: TicketingClient
      factory: NewZendeskTicketingClient
      description: Thin wrapper around the Zendesk API.

  acronyms:
    - URL
    - HTTP
    - API
    - SLA
    - SLO

  tools:
    - id: knowledge_search
      name: knowledge_search
      description: Search the company knowledge base
      tags:
        - knowledge
        - search
      schema:
        type: object
        properties:
          query: { type: string, description: The search query }
        required:
          - query
    - id: get_customer
      name: get_customer
      description: Look up a customer by ID
      tags:
        - customer
      schema:
        type: object
        properties:
          id: { type: string }
        required:
          - id
      inject:
        - customerRepo
    - id: escalate_ticket
      name: escalate_ticket
      description: Open a ticket in Zendesk for human follow-up
      tags:
        - escalation
        - ticketing
      schema:
        type: object
        properties:
          customerId: { type: string }
          summary: { type: string }
          priority:
            type: string
            enum:
              - low
              - normal
              - high
              - urgent
        required:
          - customerId
          - summary
          - priority
      inject:
        - ticketingClient

  skills:
    - id: incident-response
      bare: true
      name: incident-response
      description: How to triage a paged production incident, draft an initial response, and notify stakeholders.
      license: Apache-2.0
      tags:
        - operations
        - incident
    - id: refund-policy
      bare: true
      name: refund-policy
      description: When and how to issue refunds, with required approvals.
      license: Proprietary
      tags:
        - policy
        - refunds

  server:
    port: 8080
    scheme: https
    debug: false
    auth:
      enabled: true

  language:
    go:
      module: github.com/acme/customer-support-agent
      version: "1.26"
      vendor:
        deps:
          - github.com/google/uuid@v1.6.0
        devdeps:
          - github.com/stretchr/testify@v1.9.0

  artifacts:
    enabled: true

  hooks:
    post:
      - go vet ./...
      - go test ./...

  scm:
    provider: github
    url: https://github.com/acme/customer-support-agent
    github_app: true
    issue_templates: true
    dependabot: true
    ci: true
    cd: true

  development:
    sandbox:
      flox:
        enabled: true
      devcontainer:
        enabled: false
    ai:
      orchestrators:
        claudecode:
          enabled: true
    deps:
      - kubectl@1.31.0

  deployment:
    type: cloudrun
    cloudrun:
      image:
        registry: us-central1-docker.pkg.dev
        repository: acme/agents/customer-support
        tag: v1.0.0
        useCloudBuild: true
      resources:
        cpu: "1"
        memory: 512Mi
      scaling:
        minInstances: 1
        maxInstances: 10
        concurrency: 80
      service:
        timeout: 300
        allowUnauthenticated: false
        serviceAccount: agents@acme.iam.gserviceaccount.com
        executionEnvironment: gen2
      environment:
        LOG_LEVEL: info
```

## Highlights

- **Three tools, three concerns.** `knowledge_search` is a stateless
  retrieval call; `get_customer` and `escalate_ticket` use
  [`inject`](/reference/tools#inject) to receive typed service handles
  from `spec.services`.
- **Two MCP servers, two transports.** `filesystem` runs locally over
  `stdio`; `docs` is a remote `http` server reached with a bearer token.
  See [`spec.agent.mcps`](/reference/agent#mcps).
- **Two skills, two licences.** `incident-response` is open-source
  (Apache-2.0); `refund-policy` is `Proprietary`. The licences ride
  along in the generated `SKILL.md` frontmatter.
- **Flox sandbox + Claude Code.** A developer can `flox activate` and
  drop straight into a working dev shell with Claude Code provisioned.
- **Cloud Run target.** CD ships the agent as a Cloud Run service with
  pinned scaling and resource limits.
