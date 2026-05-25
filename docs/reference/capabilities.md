# `spec.capabilities`

Declares which protocol-level capabilities the agent supports. All three
fields are required so the schema makes the agent's contract explicit -
a runtime should never need to _guess_ whether streaming is on.

```yaml
spec:
  capabilities:
    streaming: true
    pushNotifications: true
    stateTransitionHistory: true
```

## `streaming`

- **Type:** `boolean`
- **Required:** yes

Whether the agent can stream incremental responses (typically
token-by-token) back to the caller, instead of returning a single
buffered result.

## `pushNotifications`

- **Type:** `boolean`
- **Required:** yes

Whether the agent can push notifications about state changes - useful
for long-running tasks where the caller subscribes and is informed when
something happens.

## `stateTransitionHistory`

- **Type:** `boolean`
- **Required:** yes

Whether the agent retains a record of state transitions over the course
of a task. When `true`, callers can replay or audit how the agent
reached its final state.

## A note on defaults

There are no defaults - every value must be explicitly `true` or
`false`. This is intentional: a manifest that elides `streaming` would
leave runtimes and clients unsure what to negotiate. Making the field
required forces the author to think about it.
