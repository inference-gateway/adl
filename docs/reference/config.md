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
- **Structure:** every value at the top level must itself be an object;
  inside that object, anything goes (any JSON value).

```yaml
spec:
  config:
    <group-name>:
      <any-key>: <any-value>
```

So config is grouped one level deep - typically by subsystem - and the
contents of each group are unconstrained.

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
