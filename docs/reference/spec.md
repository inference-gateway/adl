# `spec`

`spec` is where the agent is actually defined. It carries three required
blocks and a long list of optional ones.

## Required

| Field          | Reference                      |
| -------------- | ------------------------------ |
| `capabilities` | [capabilities](./capabilities) |
| `server`       | [server](./server)             |
| `language`     | [language](./language)         |

## Optional

| Field         | Reference                                  |
| ------------- | ------------------------------------------ |
| `card`        | [card](./card)                             |
| `agent`       | [agent](./agent) — provider, model, prompt |
| `config`      | [config](./config)                         |
| `services`    | [services](./services)                     |
| `acronyms`    | [acronyms](./acronyms)                     |
| `tools`       | [tools](./tools)                           |
| `skills`      | [skills](./skills)                         |
| `artifacts`   | [artifacts](./artifacts)                   |
| `hooks`       | [hooks](./hooks)                           |
| `scm`         | [scm](./scm)                               |
| `development` | [development](./development)               |
| `deployment`  | [deployment](./deployment)                 |

## Minimal valid `spec`

The three required blocks together are enough to pass validation:

```yaml
spec:
  capabilities:
    streaming: true
    pushNotifications: false
    stateTransitionHistory: false
  server:
    port: 8080
  language:
    go:
      module: github.com/example/agent
      version: "1.26"
```

Everything beyond that is opt-in — pull in only what your agent actually
uses. The schema doesn't penalise you for omitting capabilities you
don't need; it penalises ambiguity.
