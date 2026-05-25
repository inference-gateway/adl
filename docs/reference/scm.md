# `spec.scm`

Source-control configuration for the generated project — which provider
it lives on, and which provider-specific scaffolding (CI, CD,
Dependabot, issue templates, …) the generator should set up.

```yaml
spec:
  scm:
    provider: github
    url: https://github.com/company/customer-support-agent
    github_app: true
    issue_templates: true
    dependabot: true
    ci: true
    cd: true
```

## Fields

| Field             | Type      | Constraint                            | Description                                                             |
| ----------------- | --------- | ------------------------------------- | ----------------------------------------------------------------------- |
| `provider`        | `string`  | enum: `github`, `gitlab`, `bitbucket` | The SCM provider hosting the repository.                                |
| `url`             | `string`  | —                                     | Full URL of the repository.                                             |
| `github_app`      | `boolean` | —                                     | Generate GitHub App configuration (e.g. permissions, manifest).         |
| `issue_templates` | `boolean` | —                                     | Generate issue templates (bug report, feature request, …).              |
| `dependabot`      | `boolean` | —                                     | Generate a Dependabot config tracking the project's package ecosystems. |
| `ci`              | `boolean` | —                                     | Generate CI workflows (lint, test, build).                              |
| `cd`              | `boolean` | —                                     | Generate CD workflows (release, deploy).                                |

Every field is optional. Omit the block entirely if the generator's
defaults work for you, or supply only the toggles you care about.

> The `github_app` and `issue_templates` flags are most useful with
> `provider: github`; consumers may interpret or ignore them when the
> provider is `gitlab` or `bitbucket`.
