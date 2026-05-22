# Changelog

All notable changes to this project will be documented in this file.

## [0.8.0](https://github.com/inference-gateway/adl/compare/v0.7.0...v0.8.0) (2026-05-22)

### ✨ Features

* **schema:** Support per-agent toggles in development.ai config ([#12](https://github.com/inference-gateway/adl/issues/12)) ([0b4271c](https://github.com/inference-gateway/adl/commit/0b4271c067fe14483edc9a0a6ba3cf887ba6bd42)), closes [#11](https://github.com/inference-gateway/adl/issues/11)

### 👷 CI

* **claude:** Add maintainer skill ([933663d](https://github.com/inference-gateway/adl/commit/933663d49965d190964f4b9037069e9ab0b80b79))
* **deps:** Update Claude Code Action to version 1.0.131 ([b409632](https://github.com/inference-gateway/adl/commit/b409632dadd3343338e18f7d49856525607f25c0))

### 🔧 Miscellaneous

* **docs:** Rename adl-cli to cli in the README to make it fit better ([e48add3](https://github.com/inference-gateway/adl/commit/e48add353d2f4dea1a0f001690e9d01f25e0013b))

## [0.7.0](https://github.com/inference-gateway/adl/compare/v0.6.0...v0.7.0) (2026-05-22)

### ✨ Features

* **schema:** Add optional license field to Skill ([#10](https://github.com/inference-gateway/adl/issues/10)) ([534be54](https://github.com/inference-gateway/adl/commit/534be54e0fcea778d88aee845fe027f471ff9e41)), closes [#9](https://github.com/inference-gateway/adl/issues/9)

### 🔧 Miscellaneous

* Replace em dash with normal dash ([9317908](https://github.com/inference-gateway/adl/commit/931790876c8dc9bdd44b8517409eb0f33ce804b4))

## [0.6.0](https://github.com/inference-gateway/adl/compare/v0.5.0...v0.6.0) (2026-05-22)

### ✨ Features

* **schema:** Group sandbox and ai under spec.development ([#8](https://github.com/inference-gateway/adl/issues/8)) ([3c00c51](https://github.com/inference-gateway/adl/commit/3c00c5135ddd669fb5adf48e0f70ec4421974f81))

## [0.5.0](https://github.com/inference-gateway/adl/compare/v0.4.0...v0.5.0) (2026-05-22)

### ✨ Features

* **schema:** Add scm dependabot/ci/cd flags and ai.enabled config ([#6](https://github.com/inference-gateway/adl/issues/6)) ([aff6b6b](https://github.com/inference-gateway/adl/commit/aff6b6bdc69e0ba01b88a4961a3ad7ffc7a7b163)), closes [#5](https://github.com/inference-gateway/adl/issues/5)

### 👷 CI

* Update CI workflow to use Node.js instead of Go ([073ab19](https://github.com/inference-gateway/adl/commit/073ab1982c37c731f2c4489a431f6d25a0c73c68))

### 🔧 Miscellaneous

* Add Claude Code GitHub Actions workflow ([f49cf2f](https://github.com/inference-gateway/adl/commit/f49cf2fa0a9fb3e3b48d3044c0153855e63bcf23))
* Change Node.js version to LTS in workflow ([20480dd](https://github.com/inference-gateway/adl/commit/20480ddadf022740d3f7d714b2dc5f836eb5ff2b))
* **deps:** Update claude-code version to 2.1.141 and infer.flake to v0.109.11 ([103f41e](https://github.com/inference-gateway/adl/commit/103f41eded0de0e1f29f3fa649aca8cd9a551fac))

## [0.4.0](https://github.com/inference-gateway/adl/compare/v0.3.0...v0.4.0) (2026-05-19)

### ✨ Features

* **schema:** Relax Tool.required to id only ([#4](https://github.com/inference-gateway/adl/issues/4)) ([9405930](https://github.com/inference-gateway/adl/commit/9405930db5b2a95fd007b644c459741bdf4f5138))

## [0.3.0](https://github.com/inference-gateway/adl/compare/v0.2.0...v0.3.0) (2026-05-18)

### ✨ Features

* Split tools and skills ([#3](https://github.com/inference-gateway/adl/issues/3)) ([d0e3fe9](https://github.com/inference-gateway/adl/commit/d0e3fe98eb5ec260b3808e27054e00c164185ca0))

## [0.2.0](https://github.com/inference-gateway/adl/compare/v0.1.1...v0.2.0) (2026-05-18)

### ✨ Features

* Add KubernetesConfig with image field to deployment ([#2](https://github.com/inference-gateway/adl/issues/2)) ([775e439](https://github.com/inference-gateway/adl/commit/775e4391d8c28a3e83dea01e54cc01360d4ebdad))

### 📚 Documentation

* Add AGENTS.md guide for AI agents ([bdccfd0](https://github.com/inference-gateway/adl/commit/bdccfd0d3d50a29f03655b96e4dc67acbf67bcfe))
* Add CLAUDE.md with schema-repo guidance for Claude Code ([ad434c7](https://github.com/inference-gateway/adl/commit/ad434c74aa2065adcad7b4aa1859e4d0fd09bb14))
* Add CONTRIBUTING guide and README table of contents ([54f89cf](https://github.com/inference-gateway/adl/commit/54f89cf72b46a7c8ec1b9132d031c8c9962ed571))

### 🔧 Miscellaneous

* Add .env to .gitignore ([8d41c6f](https://github.com/inference-gateway/adl/commit/8d41c6f2040b2720ba9aede7c62f41f267e03ac1))
* **deps:** Bump infer cli to latest ([3e335f9](https://github.com/inference-gateway/adl/commit/3e335f9e51dc2d9c639ae5676b4f51a116f2ed60))
* Remove extra linebreak ([3b9b146](https://github.com/inference-gateway/adl/commit/3b9b146056963bdb454c2205d73db62777277618))
* Run infer init ([a627527](https://github.com/inference-gateway/adl/commit/a627527839678abaa883bbbf7b833467611b725c))

### 📦 Miscellaneous

* Add flox environment and Taskfile for local dev ([7d1b44c](https://github.com/inference-gateway/adl/commit/7d1b44caabc681a53afd49d1a0798d31e69e5e32))

## [0.1.1](https://github.com/inference-gateway/adl/compare/v0.1.0...v0.1.1) (2026-05-18)

### 📚 Documentation

* Replace the examples to be with deepseek-v4-flash ([da29695](https://github.com/inference-gateway/adl/commit/da29695f9d50b327cd573e71b67781b422327bce))
