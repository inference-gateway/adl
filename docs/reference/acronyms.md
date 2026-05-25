# `spec.acronyms`

A list of acronyms the generator should respect when producing identifiers.

```yaml
spec:
  acronyms:
    - URL
    - HTTP
    - SLA
    - SLO
    - API
```

## Shape

- **Type:** `string[]`
- **Required:** no

## Why this exists

When a generator turns a field like `httpUrl` into a Go identifier, the
naïve translation is `HttpUrl`. That's wrong in idiomatic Go, which
expects fully-uppercase acronyms (`HTTPURL`). Different languages have
different conventions, but the underlying problem is the same: the
generator needs to know which substrings are acronyms.

Listing your project's acronyms once here lets the generator produce
idiomatic identifiers consistently, instead of you fixing them up by
hand in every emitted file.

## Notes

- Casing in this list is informational; the generator decides how to
  apply each acronym based on the target language's conventions.
- Add domain-specific acronyms as well as general ones — `SLA`, `JWT`,
  `OIDC`, internal codes — anything that should not be camelCased into
  something silly.
