# `spec.hooks`

Extension points where the generator should run user-supplied commands
in addition to its built-in pipeline.

```yaml
spec:
  hooks:
    post:
      - npm run lint
      - go vet ./...
      - go test ./...
```

## Fields

| Field   | Type       | Required | Description                                                                                  |
|---------|------------|:--------:|----------------------------------------------------------------------------------------------|
| `post`  | `string[]` |          | Commands to run after code generation completes. Executed in order in the project directory. |

Each entry is an opaque string — the schema doesn't parse it. The
generator runs each command in a shell, in the order they appear, with
the generated project as the working directory.

## When to use this

- Re-running formatters or linters after generation so the resulting
  tree is shaped exactly the way your repo expects.
- Running smoke tests so generation failures show up immediately, not
  hours later in CI.
- Triggering follow-up generation steps (e.g. `protoc`, `openapi-generator`,
  `swagger-codegen`) that operate on the just-emitted files.

If a hook needs a tool, declare that tool under
[`spec.development.deps`](./development#deps) or under the relevant
language's `vendor.devdeps` so the dev sandbox has it available.
