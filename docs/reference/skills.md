# `spec.skills`

Markdown playbooks injected into the agent's system prompt at startup.
Sourced from the skills registry or scaffolded blank with `bare: true`.

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
first — it explains _when_ you want a skill instead of a tool.

## Shape

- **Type:** array of [`Skill`](#skill-fields) objects.
- **Required:** no

## Skill fields

| Field         | Type       | Required | Description                                                                           |
| ------------- | ---------- | :------: | ------------------------------------------------------------------------------------- |
| `id`          | `string`   |    ✓     | Unique identifier. Pattern: `^[a-zA-Z0-9_][a-zA-Z0-9_-]*$` — kebab-case allowed.      |
| `version`     | `string`   |          | Version of the published skill to pull from the registry.                             |
| `source`      | `string`   |          | Registry reference for a published skill.                                             |
| `bare`        | `boolean`  |          | If `true`, scaffold an empty `SKILL.md` locally instead of pulling from the registry. |
| `name`        | `string`   |          | Human-readable name. Typically matches `id`.                                          |
| `description` | `string`   |          | One-line summary of what the skill teaches.                                           |
| `license`     | `string`   |          | SPDX identifier or `Proprietary`. See [License identifiers](./license-identifiers).   |
| `tags`        | `string[]` |          | Discoverability tags.                                                                 |

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
the one for `metadata.license` — see
[License identifiers](./license-identifiers) for the full table.

The value mirrors the `license` field in the skill's `SKILL.md`
frontmatter, so the licence travels with the playbook regardless of
where it's consumed. Shipping a separate `LICENSE` file alongside
`SKILL.md` is optional and not enforced by the schema — consumers MAY
include one in the skill's source directory if their distribution
channel expects it.

> SPDX expressions like `MIT OR Apache-2.0` are not currently accepted.

## How skills affect the agent at runtime

At agent startup, the contents of each skill's `SKILL.md` are appended
to the system prompt. The model therefore sees every skill as part of
its initial instructions, and can follow them without any per-call
overhead. This is the key trade-off vs. tools: skills are "free" at
call time but expand the context window at startup.
