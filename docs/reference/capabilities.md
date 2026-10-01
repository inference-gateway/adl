# `spec.capabilities`

Declares which protocol-level capabilities the agent supports. `streaming`
and `pushNotifications` are required so the schema makes the agent's
contract explicit - a runtime should never need to _guess_ whether
streaming is on.

These are the [A2A](/guide/a2a) `AgentCard` capability flags - what a
caller reads off the agent's card before connecting. See
[A2A & the Agent Card](/guide/a2a) for what each flag means to a client.

```yaml
spec:
  capabilities:
    streaming: true
    pushNotifications: true
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

## `extendedAgentCard`

- **Type:** `boolean`
- **Required:** no

Whether the agent serves a richer, authenticated AgentCard via the A2A
`GetExtendedAgentCard` method (`GET /extendedAgentCard`) once the caller
is authenticated (A2A v1.0.1 `AgentCapabilities.extendedAgentCard`).

## A note on defaults

The required flags have no defaults - `streaming` and
`pushNotifications` must be explicitly `true` or `false`. This is
intentional: a manifest that elides `streaming` would leave runtimes and
clients unsure what to negotiate. Making the fields required forces the
author to think about it. `extendedAgentCard` is optional and defaults
to `false` - the richer card endpoint is opt-in.
