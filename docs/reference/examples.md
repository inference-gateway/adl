# `spec.examples`

Optional. Lists curated examples that demonstrate the agent's
capabilities. Consumers (e.g.
[`adl-cli`](https://github.com/inference-gateway/adl-cli)) use these to
render an "Examples" section in the generated `README.md`, linking each
example to a scratchpad or playground for the agent.

```yaml
spec:
  examples:
    - title: Basic chat
      description: A simple question-and-answer interaction
    - title: Tool use
      description: Booking a flight through the booking tool
```

## Fields

`spec.examples` is an array of `Example` entries.

### `Example`

| Field         | Type     | Description                                                                         |
| ------------- | -------- | ----------------------------------------------------------------------------------- |
| `title`       | `string` | Short, descriptive title for the example (e.g. `Basic chat`, `Tool use`). Required. |
| `description` | `string` | One- or two-sentence explanation of what the example demonstrates. Required.        |

The whole block is optional - omit `spec.examples` if the agent ships no
curated examples. When present, every entry requires both `title` and
`description`, and no other fields are accepted.
