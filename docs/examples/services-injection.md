# Services & Dependency Injection

[`spec.services`](/reference/services) declares the external
dependencies your tool code is wired against - repositories, clients,
middleware. A tool opts into one or more of them with
[`inject`](/reference/tools#inject), and the generator hands the tool
body a typed handle instead of making it reach for a service locator.
This example wires that seam end to end.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: orders-agent
  description: Order-management agent wired to its dependencies via injection
  version: "1.0.0"
  tags:
    - orders
    - commerce
spec:
  capabilities:
    streaming: true
    pushNotifications: false
    stateTransitionHistory: false

  agent:
    provider: openai
    model: gpt-4.1-mini
    systemPrompt: |
      You manage customer orders. Use the provided tools to look up
      orders and issue refunds. Never invent order data.

  services:
    orderRepo:
      type: repository
      interface: OrderRepository
      factory: NewPostgresOrderRepository
      description: Order lookup and status updates, backed by Postgres.
    paymentsClient:
      type: client
      interface: PaymentsClient
      factory: NewStripePaymentsClient
      description: Thin wrapper around the Stripe SDK for refunds.

  tools:
    # Stateless: no service handle needed.
    - id: list_order_statuses
      name: list_order_statuses
      description: List the order statuses this agent understands
      tags:
        - orders
      schema:
        type: object
        properties: {}
    # Injects one service.
    - id: get_order
      name: get_order
      description: Look up an order by ID
      tags:
        - orders
      schema:
        type: object
        properties:
          orderId: { type: string }
        required:
          - orderId
      inject:
        - orderRepo
    # Injects two services.
    - id: refund_order
      name: refund_order
      description: Issue a refund for an order
      tags:
        - orders
        - payments
      schema:
        type: object
        properties:
          orderId: { type: string }
          amountCents: { type: integer, minimum: 1 }
          reason: { type: string }
        required:
          - orderId
          - amountCents
      inject:
        - orderRepo
        - paymentsClient

  server:
    port: 8080

  language:
    go:
      module: github.com/example/orders-agent
      version: "1.26"
```

## Highlights

- **Two services, two roles.** `orderRepo` is a `repository`
  (persistence); `paymentsClient` is a `client` (external SDK). The
  [`type`](/reference/services#type-values) is a hint to the generator
  about _where_ in the generated layering to inject the dependency.
- **`inject` names match service keys.** Each string under a tool's
  `inject` is a key from `spec.services` (`orderRepo`,
  `paymentsClient`). The generator builds the matching `OrderRepository`
  / `PaymentsClient` interfaces and passes them into the tool body.
- **Inject zero, one, or many.** `list_order_statuses` injects nothing
  (it's stateless), `get_order` injects one service, and `refund_order`
  injects two - the relationship is many-to-many.
- **Factories close the loop.** `NewPostgresOrderRepository` and
  `NewStripePaymentsClient` are the constructors the generated wiring
  calls to build each dependency at startup.
