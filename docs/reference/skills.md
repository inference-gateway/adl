# `spec.skills`

Markdown playbooks the agent can discover and load on demand. Each
skill's metadata is advertised to the model at startup; the body is
read at runtime only when the model decides to use it. Sourced from
the skills registry or scaffolded blank with `bare: true`.

```yaml
spec:
  skills:
    - id: incident-response
      bare: true
      name: incident-response
      description: How to triage a paged production incident, draft an initial response, and notify stakeholders.
      license: Apache-2.0
      tags:
        - operations
        - incident
```

If you're new to skills, read [Tools vs Skills](/guide/tools-vs-skills)
first - it explains _when_ you want a skill instead of a tool.

## Shape

- **Type:** array of [`Skill`](#skill-fields) objects.
- **Required:** no

## Skill fields

| Field         | Type       | Required | Description                                                                                                                                                                                          |
| ------------- | ---------- | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | `string`   |    ✓     | Unique identifier. Pattern: `^[a-zA-Z0-9_][a-zA-Z0-9_-]*$` - kebab-case allowed.                                                                                                                     |
| `version`     | `string`   |          | Version of the published skill to pull from the registry.                                                                                                                                            |
| `source`      | `string`   |          | Registry reference for a published skill.                                                                                                                                                            |
| `bare`        | `boolean`  |          | If `true`, scaffold an empty `SKILL.md` locally instead of pulling from the registry.                                                                                                                |
| `name`        | `string`   |          | Human-readable name. Typically matches `id`.                                                                                                                                                         |
| `description` | `string`   |          | One-line summary of what the skill teaches. Surfaced to the model in the startup skill listing, so it should read as a recognizable trigger ("how to triage a paged incident", not "incident docs"). |
| `license`     | `string`   |          | SPDX identifier or `Proprietary`. See [License identifiers](./license-identifiers).                                                                                                                  |
| `tags`        | `string[]` |          | Discoverability tags.                                                                                                                                                                                |

`additionalProperties` are not allowed.

## Two sources, one shape

A skill is **either** pulled from the registry **or** scaffolded blank.
The shape of the entry tells the generator which mode you want.

### Pulled from the registry

```yaml
spec:
  skills:
    - id: prompt-engineering
      source: registry/anthropic/prompt-engineering
      version: 1.2.0
      tags:
        - prompting
```

The generator downloads the matching `SKILL.md` at build time and
includes it in the project. Pin a `version` for reproducible builds.

### Scaffolded blank (`bare: true`)

```yaml
spec:
  skills:
    - id: incident-response
      bare: true
      name: incident-response
      description: How to triage a paged production incident...
      license: Apache-2.0
      tags:
        - operations
        - incident
```

Use `bare: true` when the playbook is proprietary or one-off. The
generator emits an empty `SKILL.md` shell with the right frontmatter,
and you fill in the body. The skill's `license` (and the rest of the
metadata) ends up in `SKILL.md`'s frontmatter, so it travels with the
playbook.

## Licensing

Every skill **may** carry a `license`. The accepted enum is identical to
the one for `metadata.license` - see
[License identifiers](./license-identifiers) for the full table.

The value mirrors the `license` field in the skill's `SKILL.md`
frontmatter, so the licence travels with the playbook regardless of
where it's consumed. Shipping a separate `LICENSE` file alongside
`SKILL.md` is optional and not enforced by the schema - consumers MAY
include one in the skill's source directory if their distribution
channel expects it.

> SPDX expressions like `MIT OR Apache-2.0` are not currently accepted.

## How skills affect the agent at runtime

Skills use a two-stage, lazy-loading model:

1. **At startup - metadata only.** The agent's system prompt is
   augmented with a short index of every declared skill: each entry's
   `name` and `description` (from `SKILL.md`'s frontmatter). The model
   sees this as a "menu" of playbooks it can consult. The body of each
   `SKILL.md` is **not** loaded.
2. **At invocation - body on demand.** When the model decides a skill
   is relevant to the current turn, the runtime reads that skill's
   `SKILL.md` from disk and adds the rendered body to the
   conversation. The body stays in context for the remainder of the
   session.

This inverts the cost model of an always-on system prompt: a manifest
can declare many skills without bloating startup context, and only the
skills the model actually reaches for spend tokens. Long reference
material is effectively free until invoked.

### Runtime requirement: the `read` built-in tool

Lazy loading requires the agent to read files at runtime. `adl-cli`
auto-wires the reserved built-in tool [`read`](./tools#user-defined-vs-built-in-tools)
whenever `spec.skills[]` is non-empty, so you do not need to declare
it explicitly - it is present in the generated project by virtue of
having declared at least one skill.
