# Secrets & interpolation

ADL manifests are declarative and meant to live in source control, so
one rule is absolute: **a manifest never holds a real secret.** API
keys, tokens, and passwords are referenced with `${VAR}` placeholders
and resolved at deploy/run time by the consumer - they are not stored in
the manifest itself.

This page covers the `${VAR}` convention, which fields carry it, who
resolves it, and where the LLM provider credential actually comes from
(it is not the manifest).

## The `${VAR}` convention

Manifest examples reference secrets with a `${VAR}` placeholder that
names an environment variable to substitute at deploy/run time:

```yaml
spec:
  agent:
    mcp:
      enabled: true
      servers:
        - name: github
          transport: http
          url: https://mcp.example.com/github
          headers:
            Authorization: Bearer ${GITHUB_MCP_TOKEN}
```

Two things are true of that `${GITHUB_MCP_TOKEN}`:

- **The JSON Schema treats it as an opaque string.** There is no
  `${...}` type, and no validation of the variable name or whether it
  exists - to the schema, `Bearer ${GITHUB_MCP_TOKEN}` is just a
  `string`. `task validate` passes a manifest full of placeholders
  without complaint.
- **The consumer resolves it, not ADL.** Substitution happens in the
  tool that reads the manifest (e.g. [`adl-cli`](https://github.com/inference-gateway/adl-cli))
  or in the generated agent at startup, against the process environment.
  ADL defines only the _shape_; resolution is deliberately consumer
  territory, so a runtime can back it with a `.env` file, a Kubernetes
  `Secret`, a Cloud Run secret, a vault, and so on.

The convention is a plain `${NAME}`. Use environment-variable-style
names (uppercase with underscores) so they map cleanly onto whatever
injects them.

## Where placeholders are used

Any string field _can_ contain a `${VAR}`, but these are the fields that
exist to carry secrets and runtime configuration:

| Field                                  | Carries                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| `spec.agent.mcp.servers[].env`         | Env vars for a `stdio` MCP server - API keys or tokens the subprocess needs.   |
| `spec.agent.mcp.servers[].headers`     | Headers for an `http`/`sse` MCP server - e.g. an `Authorization` bearer token. |
| `spec.deployment.cloudrun.environment` | Env vars injected into the deployed Cloud Run service.                         |
| `spec.deployment.vercel.environment`   | Env vars injected into the Vercel deployment.                                  |
| `spec.config`                          | Free-form runtime config - reference secrets here, never inline them.          |

See [agent](./agent#mcp), [deployment](./deployment#cloud-run) (also
[Vercel](./deployment#vercel)), and [config](./config) for the full
definitions of those fields.

`spec.deployment.kubernetes` has no `environment` map of its own in v1:
it carries only the image, and the generator's templating owns the
Deployment's `env` / `envFrom` (for example, wiring values from a
`Secret`). The `cloudrun` and `vercel` targets each carry their own
`environment` map for injecting config and secrets - those are the fields
the table above lists. (Cloudflare's `environment` is plain-text wrangler
`vars` only; set true secrets out-of-band with `wrangler secret put`.)

## The LLM provider credential is not in the manifest

`spec.agent` names the provider and the model...

```yaml
spec:
  agent:
    provider: openai
    model: gpt-4.1
```

...but it has **no field for the provider API key**, by design. The
credential is supplied at runtime as an environment variable by the
generated project; it never lives in the manifest.

For projects scaffolded by
[`adl-cli`](https://github.com/inference-gateway/adl-cli), the generated
`.env.example` is the source of truth. It expects, among others:

- `A2A_AGENT_CLIENT_PROVIDER` and `A2A_AGENT_CLIENT_MODEL` - these mirror
  `spec.agent.provider` and `spec.agent.model` from the manifest.
- `A2A_AGENT_CLIENT_API_KEY` - the API key the agent's LLM client
  authenticates with.
- When the agent routes its LLM calls through the
  [Inference Gateway](https://github.com/inference-gateway/inference-gateway),
  the gateway reads provider-specific keys such as `OPENAI_API_KEY`,
  `ANTHROPIC_API_KEY`, `DEEPSEEK_API_KEY`, `GOOGLE_API_KEY`,
  `MISTRAL_API_KEY`, and `GROQ_API_KEY`.

The exact variable names are the consumer's contract, not the schema's -
treat the generated `.env.example` as authoritative for the project you
scaffold. What ADL guarantees is the split: the manifest carries the
provider/model _selection_, never the secret behind it.

## Security checklist

- **Never commit a real secret.** Put a `${VAR}` placeholder in the
  fields above and keep the real value in an untracked `.env`, a
  Kubernetes `Secret`, a Cloud Run secret, or your vault of choice.
- **Don't inline keys in `spec.config`.** It is free-form, which makes
  it the easiest place to leak one - reference a `${VAR}` instead.
- **A passing `task validate` says nothing about secrets.** The schema
  cannot tell a placeholder from a pasted key; both are valid strings.
  Scanning for committed secrets is your CI's job, not the schema's.
- **Prefer least-privilege, short-lived credentials** for the tokens you
  reference from MCP `env` and `headers`.
