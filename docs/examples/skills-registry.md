# Registry Skills & Bare Skills

A [skill](/reference/skills) is a markdown playbook the agent loads on
demand. There are two ways to source one, and the shape of the entry
tells the generator which you mean: pull a published skill from the
**registry** (`source` + `version`), or scaffold a blank one locally
(`bare: true`) and fill in the body yourself. This agent uses both.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: research-agent
  description: Research agent mixing registry-sourced skills with a proprietary bare skill
  version: "0.3.0"
  tags:
    - research
spec:
  capabilities:
    streaming: true
    pushNotifications: false
    stateTransitionHistory: false

  agent:
    provider: anthropic
    model: claude-sonnet-4-7
    systemPrompt: |
      You are a research assistant. Consult the available skills before
      answering questions about prompting or internal review policy.

  skills:
    # Pulled from the registry - downloaded at build time, pinned by version.
    - id: prompt-engineering
      source: registry/anthropic/prompt-engineering
      version: "1.2.0"
      tags:
        - prompting
    - id: citations
      source: registry/anthropic/citations
      version: "0.4.1"
      tags:
        - research
        - citations
    # Scaffolded blank - proprietary, body filled in locally.
    - id: internal-review-policy
      bare: true
      name: internal-review-policy
      description: How to run an internal red-team review before publishing research externally.
      license: Proprietary
      tags:
        - policy
        - review

  server:
    port: 8080

  language:
    go:
      module: github.com/example/research-agent
      version: "1.26"
```

## Highlights

- **Registry-sourced (`source` + `version`).** `prompt-engineering` and
  `citations` are published skills. The generator downloads the matching
  `SKILL.md` at build time; pinning a `version` keeps builds
  reproducible. You don't write `name`/`description`/`license` - they
  come with the published skill.
- **Bare (`bare: true`).** `internal-review-policy` is proprietary and
  one-off, so it's scaffolded blank. Here you _do_ supply the metadata
  (`name`, `description`, `license`); the generator emits an empty
  `SKILL.md` shell with that frontmatter and you write the body.
- **Licences travel with the playbook.** The `Proprietary` licence on
  the bare skill ends up in its `SKILL.md` frontmatter. See
  [License identifiers](/reference/license-identifiers) for the accepted
  set.
- **Lazy loading.** Only each skill's `name` + `description` is in the
  startup prompt; the body is read at runtime when the model reaches for
  it - so a manifest can declare many skills cheaply. (`adl-cli`
  auto-wires the `read` built-in tool whenever `spec.skills[]` is
  non-empty.)
