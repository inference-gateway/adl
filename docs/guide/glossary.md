# Glossary

One-line definitions of the terms that recur across the ADL docs. Each
entry links to the page where the concept is covered in full.

> Looking for [`spec.acronyms`](/reference/acronyms)? That's a schema
> field that tells generators how to case identifiers - not a glossary.
> This page defines ADL's vocabulary instead.

## A2A

The agent-to-agent protocol that ADL manifests describe: how an agent
advertises its capabilities and exchanges messages with clients and other
agents. An A2A agent does not require an LLM. See
[A2A & the Agent Card](/guide/a2a).

## AgentCard

The public, protocol-level description of a deployed agent - endpoint URL,
protocol version, and supported input/output modes - surfaced to clients
and registries. Declared under
[`spec.capabilities`](/reference/capabilities) and
[`spec.card`](/reference/card); see [A2A & the Agent Card](/guide/a2a).

## consumer

Any tool that reads an ADL manifest and acts on it: a [generator](#generator),
[runtime](#runtime), or [registry](#registry). ADL defines the contract;
consumers supply the implementation. See [What is ADL?](/guide/introduction).

## dependency injection (DI)

The pattern ADL uses to give a tool typed handles to the services it
needs: a tool lists service names under [`inject`](/reference/tools#inject)
and the generator wires the matching
[`spec.services`](/reference/services) in.

## generator

A [consumer](#consumer) that turns a manifest into a ready-to-run project
in a target language - for example
[`adl-cli`](https://github.com/inference-gateway/adl-cli). See
[What is ADL?](/guide/introduction).

## MCP (Model Context Protocol)

An open protocol for connecting an agent to external tool and context
servers at runtime, configured under
[`spec.agent.mcp`](/reference/agent#mcp). See
[Connecting to MCP Servers](/guide/mcp).

## orchestrator

A coding-agent integration - Claude Code, Codex, Gemini, OpenCode, or
`infer` - that [`spec.development.ai`](/reference/development#ai) can
provision inside the dev sandbox.

## rc channel

The pre-release channel: `rc/*` branches publish release candidates from
the manual Release workflow, kept separate from stable tags. See
[Versioning](/guide/versioning).

## registry

A [consumer](#consumer) that indexes manifests - for example by
`metadata.tags` and the chosen provider - so agents can be discovered. See
[What is ADL?](/guide/introduction).

## runtime

A [consumer](#consumer) that loads a manifest and executes the agent. ADL
itself is not a runtime; it only describes the agent. See
[What is ADL?](/guide/introduction).

## sandbox

A reproducible local development environment - flox, devcontainer, or
Docker Compose - selected under
[`spec.development.sandbox`](/reference/development#sandbox).

## SPDX

The standard identifier scheme for software licenses (e.g. `MIT`,
`Apache-2.0`). ADL accepts a single SPDX identifier or `Proprietary` for
`metadata.license` and `spec.skills[].license`. See
[License identifiers](/reference/license-identifiers).
