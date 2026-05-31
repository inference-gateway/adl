# Schema Reference - ADL v1

This is the canonical reference for every field defined in
[`schema/v1/schema.json`](https://github.com/inference-gateway/adl/blob/main/schema/v1/schema.json).
The schema is JSON Schema Draft-07 and validates manifests with
`apiVersion: adl.inference-gateway.com/v1`.

## Manifest shape

```yaml
apiVersion: adl.inference-gateway.com/v1 # required
kind: Agent # required
metadata: # required
  name: string
  description: string
  version: x.y.z
  # optional: author, license, tags
spec: # required
  capabilities: { ... } # required
  server: { ... } # required
  language: { ... } # required
  # optional: card, agent, config, services, acronyms,
  #           tools, skills, artifacts, hooks, scm,
  #           development, deployment, telemetry
```

## Top-level

| Field        | Required | Reference                               |
| ------------ | :------: | --------------------------------------- |
| `apiVersion` |    ✓     | [apiVersion / kind](./api-version-kind) |
| `kind`       |    ✓     | [apiVersion / kind](./api-version-kind) |
| `metadata`   |    ✓     | [metadata](./metadata)                  |
| `spec`       |    ✓     | [spec](./spec)                          |

## `spec.*`

| Field          | Required | Reference                      |
| -------------- | :------: | ------------------------------ |
| `capabilities` |    ✓     | [capabilities](./capabilities) |
| `card`         |          | [card](./card)                 |
| `agent`        |          | [agent](./agent)               |
| `config`       |          | [config](./config)             |
| `services`     |          | [services](./services)         |
| `acronyms`     |          | [acronyms](./acronyms)         |
| `tools`        |          | [tools](./tools)               |
| `skills`       |          | [skills](./skills)             |
| `server`       |    ✓     | [server](./server)             |
| `language`     |    ✓     | [language](./language)         |
| `artifacts`    |          | [artifacts](./artifacts)       |
| `hooks`        |          | [hooks](./hooks)               |
| `scm`          |          | [scm](./scm)                   |
| `development`  |          | [development](./development)   |
| `deployment`   |          | [deployment](./deployment)     |
| `telemetry`    |          | [telemetry](./telemetry)       |

## Appendix

- [Secrets & interpolation](./secrets) - the `${VAR}` placeholder
  convention, which fields carry it, and where the LLM provider
  credential comes from (a runtime env var, not the manifest).
- [License identifiers](./license-identifiers) - the accepted SPDX set
  for `metadata.license` and `spec.skills[].license`.
