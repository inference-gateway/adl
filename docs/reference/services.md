# `spec.services`

Declares external dependencies the agent's code should be wired against —
databases, repositories, downstream clients, middleware. Each service
gets an interface and a factory, which the generator turns into a typed
dependency-injection seam in the target language.

```yaml
spec:
  services:
    customerRepo:
      type: repository
      interface: CustomerRepository
      factory: NewPostgresCustomerRepository
      description: Customer lookup by ID, backed by Postgres.
    paymentsClient:
      type: client
      interface: PaymentsClient
      factory: NewStripePaymentsClient
      description: Thin wrapper around the Stripe SDK.
```

## Shape

- **Type:** `object`
- **Required:** no
- **Structure:** keys are service names you pick; values are
  [`Service`](#service-fields) objects.

## Service fields

Every service object requires all four fields below.

| Field         | Type     | Constraint                                            | Description                                                 |
| ------------- | -------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| `type`        | `string` | enum: `service`, `repository`, `client`, `middleware` | Broad role the service plays. Helps generators bucket DI.   |
| `interface`   | `string` | pattern `^[a-zA-Z][a-zA-Z0-9_]*$`                     | Interface/trait name the consumer code depends on.          |
| `factory`     | `string` | pattern `^[a-zA-Z][a-zA-Z0-9_]*$`                     | Factory function/constructor the runtime calls to build it. |
| `description` | `string` | —                                                     | One-line explanation of what the service does.              |

## `type` values

| Value        | Use for                                                                      |
| ------------ | ---------------------------------------------------------------------------- |
| `service`    | Domain services (business logic, multi-step workflows).                      |
| `repository` | Persistence and storage adapters.                                            |
| `client`     | Wrappers around external APIs or SDKs.                                       |
| `middleware` | Cross-cutting concerns (auth, logging, tracing) installed into the pipeline. |

## How it lands in generated code

For a Go target, the example above would surface as interfaces named
`CustomerRepository` and `PaymentsClient`, factory functions
`NewPostgresCustomerRepository` and `NewStripePaymentsClient`, and a
constructor that wires them together. The `type` is a hint to the
generator about _where_ to inject the dependency (e.g. into a repo
layer vs the handler).

You can refer to a service from a tool via the tool's [`inject`](./tools#inject)
field, so the tool body receives a typed handle when it's invoked.
