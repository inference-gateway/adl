<div align="center">

# ADL (Agent Definition Language)

A declarative language for defining AI agents, their capabilities, and skills. Think of ADL as "OpenAPI for AI Agents": a standardized specification that enables consistent agent definition, documentation, and code generation across platforms.

[![Validate Schema](https://img.shields.io/github/actions/workflow/status/inference-gateway/adl/validate-schema.yml?style=flat-square&logo=github&label=validate%20schema)](https://github.com/inference-gateway/adl/actions/workflows/validate-schema.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![Release](https://img.shields.io/github/v/release/inference-gateway/adl?style=flat-square&logo=github)](https://github.com/inference-gateway/adl/releases)
[![Schema Version](https://img.shields.io/badge/schema-v1-blue.svg?style=flat-square)](./schema/v1/schema.json)

</div>

## Table of Contents

- [What is ADL?](#what-is-adl)
- [Layout](#layout)
- [Example manifest](#example-manifest)
- [Consumers](#consumers)
- [Versioning](#versioning)
- [Why ADL?](#why-adl)
- [Contributing](#contributing)
- [License](#license)

## What is ADL?

ADL (Agent Definition Language) is a vendor-neutral, declarative specification for AI agents. Just as OpenAPI provides a standard way to describe REST services, ADL provides a standard way to describe agents: their metadata, capabilities, tools, skills, the AI provider behind them, the services they depend on, and the runtime they ship to.

This repository is the **source of truth for the ADL schema**. The JSON Schema document under [`schema/v1/schema.json`](./schema/v1/schema.json) is the canonical specification. Tools that produce or consume ADL manifests (including [`adl-cli`](https://github.com/inference-gateway/adl-cli)) pin to a tagged version of this schema.

### Tools vs Skills

ADL distinguishes two ways for an agent to act:

- **Tools** (`spec.tools[]`) are function-call entrypoints. Each tool has a JSON Schema for its inputs and is generated as code in the target language. Use a tool when the agent needs to invoke a deterministic operation (query a database, send an email, call an API).
- **Skills** (`spec.skills[]`) are markdown playbooks injected into the agent's system prompt at startup. They're either pulled from the skills registry or scaffolded blank with `bare: true`. Use a skill when you want to teach the agent a workflow, policy, or response pattern in natural language.

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
          query:
            type: string
            description: The search query
        required:
          - query
  skills:
    - id: incident-response
      bare: true
      name: incident-response
      description: How to triage a paged production incident, draft an initial response, and notify stakeholders.
      license: Apache-2.0
      tags:
        - operations
        - incident
  server:
    port: 8080
    debug: false
  language:
    go:
      module: github.com/company/customer-support-agent
      version: "1.26"
  development:
    sandbox:
      flox:
        enabled: true
      devcontainer:
        enabled: false
    ai:
      enabled: true
```

### Skill licensing

Each entry in `spec.skills[]` accepts an optional `license` string. It carries the licence under which the skill is distributed and must be drawn from the schema's accepted set of [SPDX](https://spdx.org/licenses/) identifiers, or `Proprietary` for closed-source skills.

Accepted values:

| Identifier | Notes |
|------------|-------|
| `MIT` | Permissive |
| `Apache-2.0` | Permissive, patent grant |
| `BSD-2-Clause` | Permissive |
| `BSD-3-Clause` | Permissive |
| `GPL-2.0` | Copyleft |
| `GPL-3.0` | Copyleft |
| `LGPL-2.1` | Weak copyleft |
| `LGPL-3.0` | Weak copyleft |
| `MPL-2.0` | Weak copyleft |
| `ISC` | Permissive |
| `CC0-1.0` | Public domain dedication |
| `CC-BY-4.0` | Creative Commons, attribution |
| `CC-BY-SA-4.0` | Creative Commons, attribution + share-alike |
| `Unlicense` | Public domain dedication |
| `Proprietary` | Closed-source / all rights reserved |

The value mirrors the `license` field in the skill's `SKILL.md` frontmatter, so the licence travels with the playbook regardless of where it is consumed. Shipping a separate `LICENSE` file alongside `SKILL.md` is optional and not enforced by the schema — consumers MAY include one in the skill's source directory if their distribution channel expects it.

Additional identifiers may be added in future minor versions of the schema; SPDX expressions (e.g. `MIT OR Apache-2.0`) are not currently accepted.

### Development sandboxes

`spec.development` groups everything related to the local developer
experience for an agent project:

- `spec.development.sandbox` selects reproducible dev environments -
  `flox`, `devcontainer`, or `dockerCompose`. Each is independently
  toggleable; consumers like `adl-cli` use these flags to scaffold the
  matching environment files.
- `spec.development.ai.enabled` toggles generation of AI-assistant
  documentation (`CLAUDE.md`, `AGENTS.md`) and provisioning of
  `claude-code` inside the sandbox.

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

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to set up local validation, the schema versioning rules, the commit-message convention, and the release process.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for the full text.
