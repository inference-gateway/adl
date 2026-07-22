# A2A Agent Without an LLM

ADL is not an "LLM wrapper". The [`spec.agent`](/reference/agent) block
is entirely optional - omit it and you get a deterministic A2A agent
whose behaviour is its [tools](/reference/tools), with no model in the
loop. This one routes webhooks to downstream queues.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: webhook-router
  description: Deterministic A2A agent that routes webhooks with no LLM in the loop
  version: "0.1.0"
  tags:
    - automation
    - webhooks
spec:
  capabilities:
    streaming: false
    pushNotifications: true
    stateTransitionHistory: false

  # No spec.agent block at all - this agent never calls an LLM.

  services:
    queueClient:
      type: client
      interface: QueueClient
      factory: NewSQSQueueClient
      description: Publishes routed events to the matching SQS queue.

  tools:
    - id: route_event
      name: route_event
      description: Route an incoming webhook event to the matching downstream queue
      tags:
        - routing
      schema:
        type: object
        properties:
          eventType:
            type: string
            enum:
              - order.created
              - order.cancelled
              - payment.failed
          payload:
            type: object
        required:
          - eventType
          - payload
      inject:
        - queueClient
    - id: healthcheck
      name: healthcheck
      description: Report whether the downstream queues are reachable
      tags:
        - ops
      schema:
        type: object
        properties: {}
      inject:
        - queueClient

  server:
    port: 8080

  language:
    go:
      module: github.com/example/webhook-router
      version: "1.26"
```

## Highlights

- **No `spec.agent`.** There is no provider, model, or system prompt -
  nothing calls an LLM. The agent's contract is purely its tools, and it
  still speaks A2A. (`spec.agent.mcp` lives under `agent` for exactly
  this reason: it only makes sense once a model is driving.)
- **Deterministic tools do the work.** `route_event` switches on an
  `eventType` enum; `healthcheck` reports reachability. Both are plain
  function-call entrypoints the generator turns into typed stubs.
- **Dependencies still inject.** Even without a model, tools receive
  typed [service handles](/reference/services) via
  [`inject`](/reference/tools#inject) - here, an SQS `queueClient`.
- **Streaming off.** With no token stream to relay, `streaming: false`
  fits; `pushNotifications: true` suits an async, fire-and-forward
  router.
