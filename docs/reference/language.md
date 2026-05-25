# `spec.language`

Which target language(s) the generator should produce. **At least one**
language must be configured (`minProperties: 1`).

```yaml
spec:
  language:
    go:
      module: github.com/company/customer-support-agent
      version: "1.26"
      vendor:
        deps:
          - github.com/google/uuid@v1.6.0
        devdeps:
          - github.com/stretchr/testify@v1.9.0
```

## Supported languages

| Key          | Config object                          |
| ------------ | -------------------------------------- |
| `go`         | [GoConfig](#go-config)                 |
| `typescript` | [TypeScriptConfig](#typescript-config) |
| `rust`       | [RustConfig](#rust-config)             |

Configure exactly one. The schema permits more than one language key,
but current consumers (e.g. `adl-cli`) generate code for a single
language at a time and will reject manifests with more than one.

## `go` {#go-config}

| Field     | Type     | Required | Description                                          |
| --------- | -------- | :------: | ---------------------------------------------------- |
| `module`  | `string` |    ✓     | Go module path (e.g. `github.com/company/agent`).    |
| `version` | `string` |    ✓     | Go toolchain version (e.g. `"1.26"`).                |
| `vendor`  | `object` |          | Extra packages - see [VendorConfig](#vendor-config). |

## `typescript` {#typescript-config}

| Field         | Type     | Required | Description                                           |
| ------------- | -------- | :------: | ----------------------------------------------------- |
| `packageName` | `string` |    ✓     | npm package name (kebab-case or scoped: `@org/name`). |
| `nodeVersion` | `string` |    ✓     | Node major version (e.g. `"20"`).                     |
| `vendor`      | `object` |          | Extra packages - see [VendorConfig](#vendor-config).  |

## `rust` {#rust-config}

| Field         | Type       | Required | Description                                                     |
| ------------- | ---------- | :------: | --------------------------------------------------------------- |
| `packageName` | `string`   |    ✓     | Cargo crate name.                                               |
| `version`     | `string`   |    ✓     | Crate version (e.g. `"0.1.0"`).                                 |
| `edition`     | `string`   |    ✓     | Rust edition (e.g. `"2021"`).                                   |
| `features`    | `string[]` |          | Cargo feature list to enable by default in the generated crate. |
| `vendor`      | `object`   |          | Extra packages - see [VendorConfig](#vendor-config).            |

## `vendor` {#vendor-config}

Every language config accepts an optional `vendor` block to declare
extra packages on top of whatever the generator pulls in by default.
Useful for testing libraries, linters, mock generators, or any runtime
package the scaffolding doesn't ship by default.

```yaml
vendor:
  deps:
    - <package>@<version>
  devdeps:
    - <package>@<version>
```

| Field     | Type       | Description                              |
| --------- | ---------- | ---------------------------------------- |
| `deps`    | `string[]` | Runtime/production dependencies.         |
| `devdeps` | `string[]` | Development- and test-only dependencies. |

Each entry is a string of the form `<package>@<version>` using the
target language's native package and version syntax. The schema only
validates the **shape** - language-native semantics (semver ranges,
scoped npm packages, Go module paths, etc.) are intentionally not
constrained further.

| Language            | Example entry                   |
| ------------------- | ------------------------------- |
| Go                  | `github.com/google/uuid@v1.6.0` |
| TypeScript          | `zod@3.23.0`                    |
| TypeScript (scoped) | `"@types/node@20.11.0"`         |
| Rust                | `tokio@1.36.0`                  |

Consumers (e.g. `adl-cli`) translate these into the language's lockfile
or manifest format (`go.mod`, `package.json`, `Cargo.toml`).

> If you need a package that isn't tied to a specific language - `deno`,
> `kubectl`, `terraform` - use [`spec.development.deps`](./development#deps)
> instead.
