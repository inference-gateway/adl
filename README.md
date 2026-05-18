<div align="center">

# ADL (Agent Definition Language)

A declarative language for defining AI agents, their capabilities, and skills. Think of ADL as "OpenAPI for AI Agents": a standardized specification that enables consistent agent definition, documentation, and code generation across platforms.

[![Validate Schema](https://img.shields.io/github/actions/workflow/status/inference-gateway/adl/validate-schema.yml?style=flat-square&logo=github&label=validate%20schema)](https://github.com/inference-gateway/adl/actions/workflows/validate-schema.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![Release](https://img.shields.io/github/v/release/inference-gateway/adl?style=flat-square&logo=github)](https://github.com/inference-gateway/adl/releases)
[![Schema Version](https://img.shields.io/badge/schema-v1-blue.svg?style=flat-square)](./schema/v1/schema.json)

</div>

## What is ADL?

ADL (Agent Definition Language) is a vendor-neutral, declarative specification for AI agents. Just as OpenAPI provides a standard way to describe REST services, ADL provides a standard way to describe agents: their metadata, capabilities, skills, the AI provider behind them, the services they depend on, and the runtime they ship to.

This repository is the **source of truth for the ADL schema**. The JSON Schema document under [`schema/v1/schema.json`](./schema/v1/schema.json) is the canonical specification. Tools that produce or consume ADL manifests (including [`adl-cli`](https://github.com/inference-gateway/adl-cli)) pin to a tagged version of this schema.

## Layout

```
schema/
└── v1/
    └── schema.json   # JSON Schema Draft-07 for apiVersion: adl.inference-gateway.com/v1
```

A new major version of ADL goes under `schema/v2/`, etc. Within a major version, only backwards-compatible additions are allowed.

## Example manifest

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: customer-support
  description: AI agent for handling customer inquiries
  version: "1.0.0"
spec:
  capabilities:
    streaming: true
    pushNotifications: true
    stateTransitionHistory: true
  agent:
    provider: deepseek
    model: deepseek-v4-flash
    systemPrompt: |
      You are a professional customer support agent.
    maxTokens: 4096
    temperature: 0.3
  skills:
    - id: knowledge_search
      name: knowledge_search
      description: Search the company knowledge base
      tags:
        - knowledge
        - search
      schema:
        type: object
        properties:
          query:
            type: string
            description: The search query
        required:
          - query
  server:
    port: 8080
    debug: false
  language:
    go:
      module: github.com/company/customer-support-agent
      version: "1.26"
```

## Consumers

| Tool | Description |
|------|-------------|
| [`adl-cli`](https://github.com/inference-gateway/adl-cli) | Reference generator that turns ADL manifests into enterprise-ready agent projects (Go, Rust, TypeScript). Pins this schema via its `Taskfile.yml`. |

If you build a tool that consumes ADL, please open a PR adding it to the table above.

## Versioning

- The `apiVersion` field in a manifest (`adl.inference-gateway.com/v1`) and the directory (`schema/v1/`) move together.
- Schema files are immutable once released under a git tag. Consumers pin to a tag.
- Additive, backwards-compatible changes ship as new patch/minor tags within the same major version.

## Why ADL?

The AI agent ecosystem is fragmenting fast. Every provider has a different surface; every framework has its own scaffolding. ADL gives teams one declarative manifest from which enterprise-ready agent code, configuration, documentation, and deployment manifests can be generated, vendor-agnostic and portable across platforms.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for the full text.
