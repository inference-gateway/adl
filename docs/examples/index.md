# Examples

Copy-pasteable ADL manifests for common shapes. Validate any of them
with the same workflow described in
[Getting Started](/guide/getting-started), then feed them to a generator
to get a running agent - see [Generate & Run](/guide/generate).

| Example                                             | What it shows                                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [Minimal Agent](./minimal)                          | The smallest valid manifest. Three required `spec` blocks, nothing else.                   |
| [A2A Agent Without an LLM](./no-llm)                | A deterministic agent with no `spec.agent` block - tools only, no model.                   |
| [Services & Injection](./services-injection)        | Wire `spec.services` into tools with `inject` - the DI seam end to end.                    |
| [MCP-Connected Agent](./mcp)                        | An LLM agent reaching MCP servers over both `stdio` and `http`.                            |
| [Registry Skills & Bare Skills](./skills-registry)  | Registry skills (`source` + `version`) next to a `bare: true` skill.                       |
| [Deployment Targets](./deployment)                  | `spec.deployment` for Kubernetes, Cloud Run, and Vercel.                                   |
| [Development Sandbox](./development-sandbox)        | `spec.development` - flox + devcontainer, a coding-agent orchestrator, and sandbox `deps`. |
| [Config, Telemetry & Artifacts](./config-telemetry) | `spec.config` plus the `telemetry` and `artifacts` on/off switches.                        |
| [Customer Support Agent](./customer-support)        | A realistic agent with tools, skills, services, dev sandbox, and CD.                       |
