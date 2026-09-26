# `spec.config`

Free-form key/value configuration the agent should be given at runtime.
The schema is deliberately permissive - it carries shape, not semantics.

```yaml
spec:
  config:
    cache:
      ttlSeconds: 300
      maxEntries: 1000
    featureFlags:
      newSearch: true
      experimentalRanking: false
```

## Shape

- **Type:** `object`
- **Required:** no
- **Structure:** every value at the top level must itself be an object.
  Inside your own groups, anything goes (any JSON value). The one
  exception is the reserved [`tools`](#the-reserved-tools-group) group,
  which is typed.

```yaml
spec:
  config:
    <group-name>:
      <any-key>: <any-value>
```

So config is grouped one level deep - typically by subsystem - and the
contents of each group are unconstrained, apart from `tools`.

## The reserved `tools` group {#the-reserved-tools-group}

`config.tools` carries per-tool configuration, keyed by the tool `id`
from [`spec.tools`](./tools). Five keys are reserved for the built-in
tools and have **typed, closed** shapes (`additionalProperties: false`) -
an unknown key or a wrong type fails validation. Every other key is a
user-defined tool's config and must be an **object**, but its contents
stay free-form.

```yaml
spec:
  tools:
    - id: read
    - id: fetch
  config:
    tools:
      read:
        enabled: true
        max_lines: 2000
      fetch:
        enabled: true
        allowed_domains:
          - .acme.example
      my_tool: # user-defined: must be an object, contents free-form
        retries: 3
```

Listing a built-in under `spec.tools` is not enough on its own: each one
stays off until `spec.config.tools.<id>.enabled` is `true`. See
[User-defined vs. built-in tools](./tools#user-defined-vs-built-in-tools).

### `read` {#tools-read}

| Key             | Type       | Notes                                     |
| --------------- | ---------- | ----------------------------------------- |
| `enabled`       | `boolean`  | Must be `true` to activate the built-in.  |
| `max_lines`     | `integer`  | Minimum `0`. Default file slice.          |
| `allowed_roots` | `string[]` | Readable roots; empty means project-wide. |

### `bash` {#tools-bash}

| Key               | Type       | Notes                                    |
| ----------------- | ---------- | ---------------------------------------- |
| `enabled`         | `boolean`  | Must be `true` to activate the built-in. |
| `whitelist`       | `string[]` | Allowed commands.                        |
| `timeout_seconds` | `integer`  | Minimum `0`.                             |
| `working_dir`     | `string`   | Directory commands run in.               |

### `write` and `edit` {#tools-write-edit}

| Key             | Type       | Notes                                     |
| --------------- | ---------- | ----------------------------------------- |
| `enabled`       | `boolean`  | Must be `true` to activate the built-in.  |
| `allowed_roots` | `string[]` | Writable roots; empty means project-wide. |

### `fetch` {#tools-fetch}

| Key               | Type       | Notes                                          |
| ----------------- | ---------- | ---------------------------------------------- |
| `enabled`         | `boolean`  | Must be `true` to activate the built-in.       |
| `allowed_domains` | `string[]` | Entries starting with `.` match any subdomain. |
| `max_bytes`       | `integer`  | Minimum `0`. Response byte cap.                |
| `timeout_seconds` | `integer`  | Minimum `0`.                                   |
| `download_dir`    | `string`   | Where downloads land.                          |
| `allow_downloads` | `boolean`  | Whether responses may be written to disk.      |
| `allow_internal`  | `boolean`  | See the SSRF note below.                       |

::: warning SSRF guard
When `allowed_domains` is empty, `fetch` denies internal/private
addresses by default. Set `allow_internal: true` to lift that - only do
so when the agent is meant to reach services on its own network.
:::

## Why so loose?

`config` is the schema's escape hatch for project-specific configuration
that doesn't fit a typed slot elsewhere. Generators pass the contents
straight through to the agent's runtime config layer. If a particular
key becomes common across agents, it's a candidate to graduate into a
proper typed field in a future minor schema version.

## Secrets & placeholders

Because `config` accepts any value, it is a tempting place to drop an
API key - don't. Reference secrets with `${VAR}` placeholders and let
the consumer resolve them at runtime; the schema treats the placeholder
as an opaque string. See [Secrets & interpolation](./secrets).
