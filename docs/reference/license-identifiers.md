# License identifiers

The accepted set of values for `metadata.license` and
`spec.skills[].license`. Both fields share the same enum, so the same
identifier means the same thing whether it's applied to the agent as a
whole or to an individual skill.

## Accepted values

| Identifier      | Notes                                       |
|-----------------|---------------------------------------------|
| `MIT`           | Permissive                                  |
| `Apache-2.0`    | Permissive, patent grant                    |
| `BSD-2-Clause`  | Permissive                                  |
| `BSD-3-Clause`  | Permissive                                  |
| `GPL-2.0`       | Copyleft                                    |
| `GPL-3.0`       | Copyleft                                    |
| `LGPL-2.1`      | Weak copyleft                               |
| `LGPL-3.0`      | Weak copyleft                               |
| `MPL-2.0`       | Weak copyleft                               |
| `ISC`           | Permissive                                  |
| `CC0-1.0`       | Public domain dedication                    |
| `CC-BY-4.0`     | Creative Commons, attribution               |
| `CC-BY-SA-4.0`  | Creative Commons, attribution + share-alike |
| `Unlicense`     | Public domain dedication                    |
| `Proprietary`   | Closed-source / all rights reserved         |

## Rules of the road

- **One identifier, not an expression.** SPDX expressions such as
  `MIT OR Apache-2.0` are **not** currently accepted; a single
  identifier only.
- **Mirrored in skill frontmatter.** For skills, the `license` value
  mirrors the `license` field in the skill's `SKILL.md` frontmatter so
  the licence travels with the playbook regardless of where it's
  consumed.
- **`LICENSE` file is optional.** Shipping a separate `LICENSE` file
  alongside `SKILL.md` is not enforced by the schema — consumers MAY
  include one in the skill's source directory if their distribution
  channel expects it.
- **Additive growth.** New identifiers may be added in future
  **minor** versions of the schema; existing manifests stay valid.
