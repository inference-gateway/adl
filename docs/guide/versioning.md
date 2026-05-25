# Versioning

ADL takes versioning seriously because downstream tools and runtimes pin
to schema tags. A breaking change at the wrong moment would silently
shatter every pinned consumer.

## Two version numbers, two roles

There are two versions to keep straight:

| Version                              | What it identifies                             | Example                        |
| ------------------------------------ | ---------------------------------------------- | ------------------------------ |
| **`apiVersion`** (in the manifest)   | The major schema version this manifest uses    | `adl.inference-gateway.com/v1` |
| **Git tag** of the schema repository | A specific snapshot of `schema/v1/schema.json` | `v1.3.0`                       |

The `apiVersion` and the directory under `schema/` always move together -
`schema/v1/` matches `adl.inference-gateway.com/v1`. The git tag picks a
_point in time_ within that major version.

## The additive contract

Inside a single major version (e.g. all of `v1`), only
**backwards-compatible additions** are allowed:

- ✅ New optional fields
- ✅ New entries in `definitions`
- ✅ New enum values _where consumers tolerate unknowns_

Forbidden until a new major version:

- ❌ Removing a field
- ❌ Renaming a field
- ❌ Tightening a constraint (e.g. narrowing a regex, adding a new
  `required` entry)
- ❌ Making an optional field required

A breaking change requires a new directory (`schema/v2/`) and a new
`apiVersion` string (`adl.inference-gateway.com/v2`). The two ship
together, and `v1` is **not** removed when `v2` lands - both major
versions coexist so existing manifests stay valid.

## Released tags are immutable

Once `vX.Y.Z` is cut, the schema file at that tag never changes. The git
history may look editable, but consumers pin by tag and rely on that
immutability. If a bug needs fixing, it ships as a **new patch tag** with
a forward-compatible adjustment, not a rewrite of the old tag.

## How tags get cut

Releases are **manual**. A maintainer runs the `Release` workflow via
`workflow_dispatch`; merging to `main` does not, by itself, cut a release.

The next version is decided by [Conventional Commits](https://www.conventionalcommits.org/):

| Commit type | Effect     |
| ----------- | ---------- |
| `feat`      | Minor bump |
| `fix`       | Patch bump |
| `impr`      | Patch bump |
| `refactor`  | Patch bump |
| `perf`      | Patch bump |
| `docs`      | Patch bump |
| `style`     | Patch bump |
| `test`      | Patch bump |
| `build`     | Patch bump |
| `ci`        | Patch bump |
| `chore`     | Patch bump |

`chore(release):` is excluded from the changelog. PR titles become the
squash-merge commit, so the **PR title must follow this convention**.

`rc/*` branches publish to the `rc` channel from the same manual trigger.

## Pinning, in practice

Downstream tools should pin to a specific tag. For example, `adl-cli`
pins via its `Taskfile.yml`:

```yaml
vars:
  ADL_SCHEMA_REF: v1.3.0
  ADL_SCHEMA_URL: https://raw.githubusercontent.com/inference-gateway/adl/{{.ADL_SCHEMA_REF}}/schema/v1/schema.json
```

Picking a tag is a deliberate decision: you adopt new fields by bumping
the pin, not by chasing `main`.
