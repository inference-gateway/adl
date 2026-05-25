# `apiVersion` / `kind`

The two discriminator fields at the top of every manifest.

## `apiVersion`

- **Type:** `string`
- **Required:** yes
- **Allowed value:** `adl.inference-gateway.com/v1` (constant)

```yaml
apiVersion: adl.inference-gateway.com/v1
```

The `apiVersion` ties the manifest to a **major schema version**. The
string and the directory under `schema/` always move in lockstep:
`adl.inference-gateway.com/v1` matches `schema/v1/schema.json`. A future
breaking version would be `adl.inference-gateway.com/v2`, served from
`schema/v2/schema.json`.

Why a constant in the schema? Because it guarantees a validator can't be
tricked into accepting a v2-shaped manifest with a v1 declaration (or
vice versa). Pick the right tag, pin to it, and the validator enforces
the rest.

## `kind`

- **Type:** `string`
- **Required:** yes
- **Allowed value:** `Agent` (constant)

```yaml
kind: Agent
```

Reserved so future kinds - `AgentTemplate`, `AgentGroup`, etc. - can
coexist in the same `apiVersion` family without breaking existing
tooling.

## Combined

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata: { ... }
spec: { ... }
```

A manifest missing either field fails validation immediately, before any
of the deeper structure is checked.
