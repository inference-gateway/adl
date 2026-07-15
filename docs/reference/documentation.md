# `spec.documentation`

Optional. Lists hand-authored documentation pages the generated project
owns and ships itself. Each entry in `pages` declares a page the consumer
(e.g. [`adl-cli`](https://github.com/inference-gateway/adl-cli)) scaffolds
as a stub markdown file at `path` with the given `title`, for the
maintainers to fill in.

This is distinct from [`spec.card.documentationUrl`](./card), which is a
single link to _already-published_ external docs. `documentation.pages`
instead describes the docs the project generates and maintains in-tree.

```yaml
spec:
  documentation:
    pages:
      - title: Getting Started
        path: docs/getting-started.md
      - title: Configuration
        path: docs/configuration.md
```

## Fields

| Field   | Type                  | Description                                               |
| ------- | --------------------- | --------------------------------------------------------- |
| `pages` | `DocumentationPage[]` | The pages to scaffold. Required, with at least one entry. |

### `DocumentationPage`

| Field   | Type     | Description                                                                        |
| ------- | -------- | ---------------------------------------------------------------------------------- |
| `title` | `string` | Human-readable page title, used as the heading and in navigation. Required.        |
| `path`  | `string` | Destination path for the stub file, relative to the project's docs root. Required. |

The whole block is optional - omit `spec.documentation` if the project
doesn't ship its own docs. When present, `pages` must list at least one
page, and every page requires both `title` and `path`.
