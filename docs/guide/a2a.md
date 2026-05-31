# A2A & the Agent Card

ADL describes **A2A agents**. A2A (Agent-to-Agent) is an open protocol for
how an agent advertises what it can do and exchanges messages with clients
and other agents over HTTP. ADL is the manifest; A2A is the protocol the
generated agent speaks on the wire. For the full wire format, see the
upstream [A2A specification](https://a2a-protocol.org/latest/specification/).

> A2A does not require an LLM. The protocol is about how agents are
> _discovered_ and _talk to each other_ - an agent can satisfy it with
> deterministic [tools](/reference/tools) alone and no
> [`spec.agent`](/reference/agent) block. See
> [A2A Agent Without an LLM](/examples/no-llm).

## The Agent Card

Every A2A agent publishes an **Agent Card**: a small JSON document, served
at `/.well-known/agent-card.json`, that tells callers who the agent is,
where it lives, which protocol version and transport it speaks, and what it
can do. It's the discovery handshake - a client fetches the card before it
sends a single message.

ADL doesn't make you write that JSON by hand. Three manifest blocks
_declare_ the card, and the generator emits `.well-known/agent-card.json`
from them (see [Generate & Run](/guide/generate)):

- [`metadata`](/reference/metadata) - the agent's name, description, and
  version.
- [`spec.capabilities`](/reference/capabilities) - the protocol features the
  agent supports.
- [`spec.card`](/reference/card) - endpoint URL, protocol version,
  transport, and the input/output modes it accepts.

[`spec.skills`](/reference/skills) also surface on the card, so callers can
discover what the agent knows how to do.

## What the capability flags mean to a caller

[`spec.capabilities`](/reference/capabilities) is **required** because it's
part of the contract a caller reads off the card _before_ connecting. Each
flag answers a question the client needs settled up front:

- **`streaming`** - can the caller subscribe to incremental results
  (Server-Sent Events), or must it wait for a single buffered response?
- **`pushNotifications`** - can the caller register a webhook and be
  notified of progress on a long-running task instead of polling for it?
- **`stateTransitionHistory`** - can the caller ask the agent to replay how
  a task moved through its states, for auditing or debugging?

A runtime should never have to _guess_ these, so the schema makes all three
explicit - see
[the note on defaults](/reference/capabilities#a-note-on-defaults).

## ADL → A2A Agent Card

Each ADL manifest field maps to a field on the published A2A `AgentCard` -
in most cases the same name, with the ADL container (`metadata`,
`spec.capabilities`, `spec.card`) dropped:

```text
ADL manifest field                          A2A AgentCard field
------------------------------------------  ----------------------------------
metadata.name                           ->  name
metadata.description                    ->  description
metadata.version                        ->  version
spec.capabilities.streaming             ->  capabilities.streaming
spec.capabilities.pushNotifications     ->  capabilities.pushNotifications
spec.capabilities.stateTransitionHistory -> capabilities.stateTransitionHistory
spec.card.protocolVersion               ->  protocolVersion
spec.card.url                           ->  url
spec.card.preferredTransport            ->  preferredTransport
spec.card.defaultInputModes             ->  defaultInputModes
spec.card.defaultOutputModes            ->  defaultOutputModes
spec.card.documentationUrl              ->  documentationUrl
spec.card.iconUrl                       ->  iconUrl
spec.skills[]                           ->  skills[]
```

In A2A the capability flags are nested under a `capabilities` object on the
card. ADL keeps them as a separate **required** block
([`spec.capabilities`](/reference/capabilities)) and folds them back in at
generation time. Everything under [`spec.card`](/reference/card) is
optional; omit the block and the generator still produces a valid card from
`metadata` and `capabilities`.

## Next steps

- [`spec.capabilities`](/reference/capabilities) - the three required
  protocol flags, field by field.
- [`spec.card`](/reference/card) - every card field and its type.
- [Generate & Run](/guide/generate) - where the card is emitted inside a
  generated project.
- [A2A Agent Without an LLM](/examples/no-llm) - an A2A agent that speaks the
  protocol with tools only.
- [Glossary](/guide/glossary) - one-line definitions of A2A, AgentCard, and
  the rest of ADL's vocabulary.
