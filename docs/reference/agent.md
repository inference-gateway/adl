# `spec.agent`

LLM-side configuration: which provider, which model, the system prompt,
and standard sampling knobs.

```yaml
spec:
  agent:
    provider: deepseek
    model: deepseek-v4-flash
    systemPrompt: |
      You are a professional customer support agent.
    maxTokens: 4096
    temperature: 0.3
```

## `provider`

- **Type:** `string`
- **Required:** no
- **Allowed values:** `""`, `openai`, `anthropic`, `ollama`, `deepseek`,
  `google`, `mistral`, `groq`.

The provider behind the LLM. The empty string is allowed for manifests
that defer provider selection to deploy time.

New providers may be added in future **minor** schema versions. Consumers
should be lenient about unknown values when reading newer manifests.

## `model`

- **Type:** `string`
- **Required:** no

The model identifier for the chosen provider (e.g. `gpt-4o-mini`,
`claude-sonnet-4-7`, `deepseek-v4-flash`). The schema doesn't constrain
the value - providers move fast, and the model catalogue is consumer
territory.

## `systemPrompt`

- **Type:** `string`
- **Required:** no

The system prompt the agent boots with. Skills (see
[`spec.skills`](./skills)) are injected on top of this prompt at
startup, so keep `systemPrompt` focused on identity and ground rules,
and put workflows into skills.

## `maxTokens`

- **Type:** `integer`
- **Required:** no
- **Minimum:** `1`

Upper bound on tokens the model may emit per response. Optional - many
runtimes default to a provider-specific value when omitted.

## `temperature`

- **Type:** `number`
- **Required:** no
- **Minimum:** `0`
- **Maximum:** `2`

Sampling temperature. `0` makes the model maximally deterministic, `2`
maximally creative. The clamp matches what most providers actually
accept.
