# Tools vs Skills

ADL distinguishes **two ways an agent can act**. The distinction is the
single most important concept in the schema, and it shapes how downstream
generators wire your manifest into runnable code.

## The short version

|                           | **Tool**                                                  | **Skill**                                                            |
| ------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| **Where it lives**        | `spec.tools[]`                                            | `spec.skills[]`                                                      |
| **Shape**                 | Function call with a JSON Schema for inputs               | Markdown playbook                                                    |
| **How the agent uses it** | The model calls it as a function                          | The text is injected into the system prompt at startup               |
| **Generated as**          | Code stubs in the target language                         | A bundled `SKILL.md` (or scaffolded blank with `bare: true`)         |
| **Best for**              | Deterministic operations (DB query, API call, send email) | Workflows, policies, response patterns expressed in natural language |
| **Carries a license?**    | No                                                        | Yes (SPDX or `Proprietary`)                                          |

## Why two concepts?

Real agents need both:

- **Some things are deterministic.** "Look up this customer by ID" is a
  function call against a database. You want a typed input, a typed
  output, no creative interpretation by the LLM. That's a **tool**.
- **Some things are judgment-laden.** "If the user reports an outage,
  triage it like this: first check our status page, then …" is a
  procedure written in prose. There's no `triageOutage()` function — you
  want the model to follow the _approach_. That's a **skill**.

Trying to express a skill as a tool produces a brittle, hard-to-test
function with a giant `instructions: string` parameter. Trying to express
a tool as a skill produces a model that hallucinates calls it can't
actually make. The split keeps each in its lane.

## Tools

```yaml
spec:
  tools:
    - id: knowledge_search
      name: knowledge_search
      description: Search the company knowledge base
      tags:
        - knowledge
        - search
      schema:
        type: object
        properties:
          query:
            type: string
            description: The search query
        required:
          - query
```

The `schema` is free-form JSON Schema — it describes the tool's input
arguments. The generator uses it to emit a typed function signature in
your target language (e.g. a Go struct with json tags, a TypeScript
interface, a Rust struct with serde derives) plus a stub function body
for you to fill in.

A tool's `id` must match `^[a-zA-Z_][a-zA-Z0-9_]*$` — it becomes a symbol
name in generated code.

Some `id`s are reserved as **built-in tools** that the generator
implements for you (e.g. `read`, `bash`, `write`, `edit`). For those,
`name`, `description`, `tags`, and `schema` may be omitted — the generator
supplies them.

See [Reference: tools](/reference/tools) for every field.

## Skills

```yaml
spec:
  skills:
    - id: incident-response
      bare: true
      name: incident-response
      description: How to triage a paged production incident, draft an initial
        response, and notify stakeholders.
      license: Apache-2.0
      tags:
        - operations
        - incident
```

A skill is a markdown playbook. At agent startup, its contents are
**injected into the system prompt** so the model sees the procedure as
part of its instructions.

Two sources:

- **`bare: true`** — scaffold an empty `SKILL.md` for you to fill in
  locally. Use this for proprietary workflows or one-off playbooks.
- **From the registry** — set `source` (and optionally `version`) to pull
  a published skill from the shared registry. Use this for common
  playbooks you don't want to maintain yourself.

Every skill carries a `license` (SPDX identifier or `Proprietary`), so
the licence travels with the playbook regardless of where it's consumed.
See [Reference: License identifiers](/reference/license-identifiers) for
the accepted set.

See [Reference: skills](/reference/skills) for every field.

## Picking between them

A quick decision tree:

1. **Does the action have side effects on an external system?** (write to
   DB, call an API, send a notification) → almost certainly a **tool**.
2. **Is the "action" really a procedure the model should follow?** (how
   to handle a refund request, how to escalate, what tone to use) →
   **skill**.
3. **Both?** Many features split cleanly: a `refund` _tool_ that issues
   the API call, plus a `refund-policy` _skill_ that tells the model
   _when_ and _how_ to issue refunds.

When in doubt, ask: _if I removed the LLM and called this from a script,
would the script still make sense?_ If yes, it's a tool. If the
"function" is "be a thoughtful assistant about X", it's a skill.
