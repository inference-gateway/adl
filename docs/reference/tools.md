# `spec.tools`

Function-call entrypoints the agent can invoke at runtime. The
generator turns each tool into a typed stub in the target language.

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

## Shape

- **Type:** array of [`Tool`](#tool-fields) objects.
- **Required:** no

## Tool fields

| Field         | Type       | Required | Description                                                                                  |
|---------------|------------|:--------:|----------------------------------------------------------------------------------------------|
| `id`          | `string`   |    ✓     | Unique identifier. Pattern: `^[a-zA-Z_][a-zA-Z0-9_]*$`. Becomes the symbol name in code.     |
| `name`        | `string`   |          | Human-readable name. Required for user-defined tools (see below).                            |
| `description` | `string`   |          | What the tool does. Required for user-defined tools.                                         |
| `tags`        | `string[]` |          | Discoverability/grouping tags. Required for user-defined tools.                              |
| `schema`      | `object`   |          | Free-form JSON Schema for the tool's input parameters. Required for user-defined tools.      |
| `inject`      | `string[]` |          | Names of services from [`spec.services`](./services) to inject when the tool body is invoked. |

`additionalProperties` are not allowed — anything outside this set fails
validation.

## User-defined vs. built-in tools

The schema makes a deliberate split:

- **User-defined tools** must supply `name`, `description`, `tags`, and
  `schema` — that's how the generator knows what to wire up.
- **Built-in tools** use reserved IDs (`read`, `bash`, `write`, `edit`,
  …) and may omit those fields. The generator supplies the canonical
  name, description, tags, and schema for built-ins.

In practice: list a built-in by ID only when you want the generator to
include it; list a user-defined tool with all four metadata fields when
you want a new function in your agent.

```yaml
spec:
  tools:
    # Built-in: generator fills in the rest
    - id: read
    - id: bash

    # User-defined: must spell everything out
    - id: send_email
      name: send_email
      description: Send a transactional email via Postmark
      tags: [communication, email]
      schema:
        type: object
        properties:
          to: { type: string, format: email }
          subject: { type: string }
          body: { type: string }
        required: [to, subject, body]
```

## `schema`

A free-form [JSON Schema](https://json-schema.org/) describing the
tool's input parameters. The ADL schema deliberately doesn't constrain
its contents — anything a JSON Schema validator accepts is allowed.
Generators turn this into a typed input struct (Go), interface
(TypeScript), or struct (Rust), and surface it to the LLM via the
provider's function-calling API.

### Common patterns

```yaml
# Simple required-string input
schema:
  type: object
  properties:
    query: { type: string }
  required: [query]

# Enum-constrained input
schema:
  type: object
  properties:
    region:
      type: string
      enum: [us-east-1, us-west-2, eu-west-1]
  required: [region]

# Nested object
schema:
  type: object
  properties:
    customer:
      type: object
      properties:
        id: { type: string }
        email: { type: string, format: email }
      required: [id]
  required: [customer]
```

## `inject` {#inject}

A list of service names from [`spec.services`](./services) that should
be wired into the tool body when the generator emits the stub. The
generator uses these names to construct typed parameters or struct
fields, so the tool implementation receives the dependencies directly
rather than reaching out to a service locator.

```yaml
spec:
  services:
    customerRepo:
      type: repository
      interface: CustomerRepository
      factory: NewPostgresCustomerRepository
      description: ...
  tools:
    - id: get_customer
      name: get_customer
      description: Look up a customer by ID
      tags: [customer]
      schema:
        type: object
        properties:
          id: { type: string }
        required: [id]
      inject:
        - customerRepo
```

Each entry must match the pattern
`^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$` — a single
identifier or a dotted path (`foo.bar.baz`) for sub-references.
