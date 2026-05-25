# `metadata`

Identifying information about the agent. Three required fields, three
optional.

```yaml
metadata:
  name: customer-support # required
  description: ... # required
  version: "1.0.0" # required
  author: # optional
    name: Acme Corp
    email: agents@acme.example
    url: https://acme.example
  license: Apache-2.0 # optional
  tags: # optional
    - support
    - customer-service
```

## `metadata.name`

- **Type:** `string`
- **Required:** yes
- **Pattern:** `^[a-z0-9-]+$` — lowercase letters, digits, and hyphens only.

The agent's canonical identifier. Generators turn this into package and
service names, so the kebab-case constraint is enforced for portability
across languages and runtimes.

## `metadata.description`

- **Type:** `string`
- **Required:** yes

A one-line summary of the agent. Surfaces in registries, README files,
and generated documentation. Keep it short and behaviour-focused
("Handles customer inquiries", not "An agent built with ADL").

## `metadata.version`

- **Type:** `string`
- **Required:** yes
- **Pattern:** `^\d+\.\d+\.\d+$` — semantic versioning `MAJOR.MINOR.PATCH`.

The agent's own version, independent of the schema version. Bump it
when you change the agent's behaviour. Pre-release suffixes (`-rc.1`)
are not currently accepted by the pattern.

## `metadata.author`

- **Type:** `object`
- **Required:** no
- **Required sub-fields when present:** `name`

```yaml
metadata:
  author:
    name: Acme Corp # required when author is present
    email: agents@acme.example # optional, format: email
    url: https://acme.example # optional, format: uri
```

Attribution and contact for whoever publishes the agent. Surfaces in
registries and the generated project's documentation. `additionalProperties`
are not allowed — only `name`, `email`, and `url`.

## `metadata.license`

- **Type:** `string`
- **Required:** no
- **Allowed values:** SPDX identifiers, or `Proprietary`.

```yaml
metadata:
  license: Apache-2.0
```

The licence the **agent** is distributed under. Mirrors the enum used by
`spec.skills[].license`, so the same accepted set applies at both levels.
See [License identifiers](./license-identifiers) for the full table.

> SPDX expressions like `MIT OR Apache-2.0` are **not** currently
> accepted — a single identifier only.

## `metadata.tags`

- **Type:** `string[]`
- **Required:** no

Discoverability tags for the agent (e.g. `calendar`, `automation`).
Consumers may merge these with tool- and skill-level tags when indexing
or building a search experience over a registry.

```yaml
metadata:
  tags:
    - support
    - customer-service
```
