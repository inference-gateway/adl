<div align="center">

# ADL (Agent Definition Language)

A declarative language for defining AI agents, their capabilities, and skills. Think of ADL as "OpenAPI for AI Agents": a standardized specification that enables consistent agent definition, documentation, and code generation across platforms.

[![Validate Schema](https://img.shields.io/github/actions/workflow/status/inference-gateway/adl/validate-schema.yml?style=flat-square&logo=github&label=validate%20schema)](https://github.com/inference-gateway/adl/actions/workflows/validate-schema.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)
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
      vendor:
        deps:
          - github.com/google/uuid@v1.6.0
        devdeps:
          - github.com/stretchr/testify@v1.9.0
  development:
    sandbox:
      flox:
        enabled: true
      devcontainer:
        enabled: false
    ai:
      claudecode:
        enabled: true
      codex:
        enabled: false
      gemini:
        enabled: false
      opencode:
        enabled: false
      infer:
        enabled: false
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

### Extra language dependencies

Every language config under `spec.language.<lang>` accepts an optional
`vendor` block that lets a manifest declare extra packages the
generator should pull into the project on top of its defaults — useful
for testing libraries, linters, mock generators, or any runtime
package the generated scaffolding doesn't ship by default.

- `vendor.deps` — runtime/production dependencies.
- `vendor.devdeps` — development- and test-only dependencies.

Each entry is a string of the form `<package>@<version>` using the
target language's native package and version syntax. Consumers (such
as `adl-cli`) translate these into the language's lockfile / manifest
format (`go.mod`, `package.json`, `Cargo.toml`, ...).

```yaml
spec:
  language:
    go:
      module: github.com/company/customer-support-agent
      version: "1.26"
      vendor:
        deps:
          - github.com/google/uuid@v1.6.0
        devdeps:
          - github.com/stretchr/testify@v1.9.0
          - go.uber.org/mock@v0.4.0
    typescript:
      packageName: customer-support-agent
      nodeVersion: "20"
      vendor:
        deps:
          - zod@3.23.0
        devdeps:
          - vitest@1.6.0
          - "@types/node@20.11.0"
    rust:
      packageName: customer-support-agent
      version: "0.1.0"
      edition: "2021"
      vendor:
        deps:
          - tokio@1.36.0
        devdeps:
          - mockall@0.12.1
```

Both fields are optional and default to empty. The schema only
validates the `<package>@<version>` shape — it intentionally does not
constrain the package or version syntax further, so each language's
native conventions (Go module paths, npm scoped packages, semver
ranges, etc.) are accepted.

### Development sandboxes

`spec.development` groups everything related to the local developer
experience for an agent project:

- `spec.development.sandbox` selects reproducible dev environments -
  `flox`, `devcontainer`, or `dockerCompose`. Each is independently
  toggleable; consumers like `adl-cli` use these flags to scaffold the
  matching environment files.
- `spec.development.ai` configures generation of AI-assistant
  documentation (`CLAUDE.md`, `AGENTS.md`) and provisioning of coding
  agents inside the sandbox. Each supported coding agent is toggled
  independently via its own subsection, and every agent is disabled by
  default:

  | Field | Coding agent |
  |-------|--------------|
  | `claudecode.enabled` | Anthropic Claude Code |
  | `codex.enabled` | OpenAI Codex |
  | `gemini.enabled` | Google Gemini |
  | `opencode.enabled` | OpenCode |
  | `infer.enabled` | Inference Gateway `infer` |

  Multiple agents can be enabled at once if a project wants to ship
  configuration for more than one.
- `spec.development.deps` declares extra packages to install into the
  development sandbox itself (flox, devcontainer, dockerCompose) on top
  of whatever the generator pulls in by default. Use this for
  cross-cutting tools that aren't tied to one of the project's
  languages — e.g. a Go service that also needs `deno` for quick
  scripting, or a TypeScript agent that wants `kubectl` available in
  the dev shell.

  Each entry follows the same `<package>@<version>` shape as
  `spec.language.<lang>.vendor.deps`:

  ```yaml
  spec:
    development:
      sandbox:
        flox:
          enabled: true
      deps:
        - deno@2.1.4
        - kubectl@1.31.0
        - terraform@1.9.5
  ```

  The schema only validates the `<package>@<version>` shape;
  consumers (e.g. `adl-cli`) are responsible for resolving each entry
  against the sandbox's native package source — Nixpkgs for flox, an
  apt/apk package or devcontainer feature for devcontainer, image
  layers for dockerCompose. The field is optional and defaults to
  empty.

## Consumers

| Tool | Description |
|------|-------------|
| [`cli`](https://github.com/inference-gateway/adl-cli) | Reference generator that turns ADL manifests into enterprise-ready agent projects (Go, Rust, TypeScript). Pins this schema via its `Taskfile.yml`. |

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

This project is licensed under the Apache 2.0 License. See [LICENSE](./LICENSE) for the full text.
