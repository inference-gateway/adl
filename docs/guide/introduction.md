# What is ADL?

**ADL (Agent Definition Language)** is a vendor-neutral, declarative
specification for AI agents. Just as [OpenAPI](https://www.openapis.org/)
provides a standard way to describe REST services, ADL provides a standard
way to describe agents: their metadata, capabilities, tools, skills, the AI
provider behind them, the services they depend on, and the runtime they
ship to.

## The shape of a manifest

Every ADL manifest is a YAML (or JSON) document with four required
top-level fields:

| Field        | Description                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `apiVersion` | The schema version this manifest targets - currently `adl.inference-gateway.com/v1`.                                       |
| `kind`       | Always `Agent`. Reserved so future kinds (e.g. `AgentTemplate`) can coexist.                                               |
| `metadata`   | Name, description, version, optional author, license, and tags.                                                            |
| `spec`       | Everything that defines the agent's behaviour - capabilities, tools, skills, server, runtime, documentation, and examples. |

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: customer-support
  description: AI agent for handling customer inquiries
  version: "1.0.0"
spec:
  # ...
```

Manifests can also carry **documentation pages** (`spec.documentation.pages`) that the generated project ships in-tree, and **curated examples** (`spec.examples`) that demonstrate the agent's capabilities. See the [documentation](/reference/documentation) and [examples](/reference/examples) reference pages for details.

## What an ADL manifest is - and isn't

ADL is **declarative**: it describes _what_ an agent should look like, not
_how_ to build it. The schema deliberately stops at the boundary between
declaration and implementation. Consumers - generators like
[`adl-cli`](https://github.com/inference-gateway/adl-cli), runtimes, or
registries - fill in the implementation, while ADL guarantees the shape of
the contract.

ADL **is**:

- A single source of truth for an agent's surface and runtime.
- A portable, version-pinned schema that downstream tools can rely on.
- Strict about additive evolution: once a tag is cut, the schema at that
  tag never changes.

ADL is **not**:

- A runtime. ADL itself doesn't execute anything; it's a description.
- A model framework. ADL is provider-agnostic; it carries provider/model
  identifiers but doesn't bundle SDKs.
- A package manager. Vendor entries like `<package>@<version>` are
  pass-through strings - the schema only validates the shape, the
  consumer resolves them against the right ecosystem.

## How it fits together

```
                            ┌────────────────────────┐
                            │  agent.yaml (ADL v1)   │
                            └───────────┬────────────┘
                                        │
                ┌───────────────────────┼───────────────────────┐
                │                       │                       │
        ┌───────▼──────┐        ┌───────▼──────┐        ┌───────▼──────┐
        │   adl-cli    │        │   registry   │        │   runtime    │
        │  (codegen)   │        │   indexing   │        │  (executor)  │
        └───────┬──────┘        └──────────────┘        └──────────────┘
                │
   ┌────────────┼────────────┐
   │            │            │
┌──▼──┐      ┌──▼──┐      ┌──▼──┐
│  Go │      │  TS │      │ Rust│
└─────┘      └─────┘      └─────┘
```

Generators read the manifest, validate it against the schema, and emit a
ready-to-run project. Registries can index by `metadata.tags` and the
provider chosen in `spec.agent`. Runtimes can use the same manifest to
load and execute the agent.

## Next steps

- [Getting Started](/guide/getting-started) - install the validator and
  write your first manifest.
- [Generate & Run](/guide/generate) - turn that manifest into a running
  agent with `adl-cli`.
- [Tools vs Skills](/guide/tools-vs-skills) - the single most important
  concept in ADL.
- [Schema Reference](/reference/) - every field, what it does, and how it
  validates.
- [Glossary](/guide/glossary) - one-line definitions of the cross-cutting
  terms used throughout these docs.
