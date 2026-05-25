---
layout: home

hero:
  name: ADL
  text: Agent Definition Language
  tagline: A vendor-neutral, declarative specification for AI agents. Think "OpenAPI for AI agents".
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Reference
      link: /reference/
    - theme: alt
      text: View on GitHub
      link: https://github.com/inference-gateway/adl

features:
  - icon: 📐
    title: One manifest, many outputs
    details: Describe an agent once in YAML. Generators turn it into Go, Rust, or TypeScript scaffolding, deployment manifests, and AI-assistant documentation.
  - icon: 🧰
    title: Tools and Skills
    details: Function-call entrypoints (tools) and markdown playbooks (skills) live side-by-side, so deterministic operations and natural-language workflows are first-class citizens.
  - icon: 🔌
    title: Vendor-agnostic
    details: Swap providers (OpenAI, Anthropic, DeepSeek, Google, Mistral, Ollama, Groq) without rewriting your agent. ADL stays portable across platforms.
  - icon: 📦
    title: Reproducible dev sandboxes
    details: First-class flox, devcontainer, and docker-compose support. Provision Claude Code, Codex, Gemini, OpenCode, or Infer into the sandbox out of the box.
  - icon: 🚀
    title: Deployment built-in
    details: Generate Kubernetes manifests or Cloud Run service configs from the same source of truth, with image, scaling, and resource constraints declaratively expressed.
  - icon: 🔒
    title: Strict additive contract
    details: Inside a major version, only backwards-compatible additions are allowed. Tagged schema files are immutable. Consumers pin a tag and stay safe.
---

## Why ADL?

The AI agent ecosystem is fragmenting fast. Every provider has a different
surface; every framework has its own scaffolding. ADL gives teams **one
declarative manifest** from which enterprise-ready agent code, configuration,
documentation, and deployment manifests can be generated — vendor-agnostic
and portable across platforms.

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
    systemPrompt: You are a professional customer support agent.
  server:
    port: 8080
  language:
    go:
      module: github.com/company/customer-support-agent
      version: "1.26"
```

Feed that file into [`adl-cli`](https://github.com/inference-gateway/adl-cli) and
get a complete agent project — server, handlers, tests, sandbox, CI, and
deployment manifests — in the language of your choice.

## Where to go next

- **New to ADL?** Start with [What is ADL?](/guide/introduction) and then
  [Getting Started](/guide/getting-started).
- **Looking up a specific field?** Jump into the
  [Schema Reference](/reference/).
- **Want to see real manifests?** Browse the
  [Examples](/examples/).
