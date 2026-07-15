# Changelog

All notable changes to this project will be documented in this file.

## [0.20.1](https://github.com/inference-gateway/adl/compare/v0.20.0...v0.20.1) (2026-07-15)

### ♻️ Improvements

* **schema:** extract examples array into Examples definition ([#110](https://github.com/inference-gateway/adl/issues/110)) ([30e8b90](https://github.com/inference-gateway/adl/commit/30e8b90666610afd4fe06cd4dacf0e42be66a602))

## [0.20.0](https://github.com/inference-gateway/adl/compare/v0.19.0...v0.20.0) (2026-07-15)

### ✨ Features

* add spec.documentation.pages to schema ([#107](https://github.com/inference-gateway/adl/issues/107)) ([cc76267](https://github.com/inference-gateway/adl/commit/cc76267a49d2a2128d6b4256b219bef1f171db96))
* **schema:** add spec.examples to schema ([#109](https://github.com/inference-gateway/adl/issues/109)) ([183f6d1](https://github.com/inference-gateway/adl/commit/183f6d143d5c71de9426e79dfe36494f07c98b03))

## [0.19.0](https://github.com/inference-gateway/adl/compare/v0.18.1...v0.19.0) (2026-07-14)

### ✨ Features

* nest telemetry exporters under each signal (otlp/prometheus) ([#104](https://github.com/inference-gateway/adl/issues/104)) ([1ed87b6](https://github.com/inference-gateway/adl/commit/1ed87b6ff5ffef49c74826d19275918162db9f12))

## [0.18.1](https://github.com/inference-gateway/adl/compare/v0.18.0...v0.18.1) (2026-07-14)

### 👷 CI

* **claude:** centralize claude.yml via reusable workflow ([#100](https://github.com/inference-gateway/adl/issues/100)) ([7dabb30](https://github.com/inference-gateway/adl/commit/7dabb308455cfad93b1b00dc4d5e625279950405))
* **infer:** centralize infer.yml via reusable workflow ([#97](https://github.com/inference-gateway/adl/issues/97)) ([ce0b5e2](https://github.com/inference-gateway/adl/commit/ce0b5e252919b189f31709de9e25c7b3a6e9a1f2))
* **infer:** centralize infer.yml via reusable workflow ([#98](https://github.com/inference-gateway/adl/issues/98)) ([31b7957](https://github.com/inference-gateway/adl/commit/31b79571d779892dca3947988a26d0212dc58f57))
* **release:** update semantic release and plugins to latest versions with local installation ([5693db5](https://github.com/inference-gateway/adl/commit/5693db5e7622a308c6b886729e3e49600fa406b5))

### 🔧 Miscellaneous

* **deps:** bump claude-code 2.1.197 -> 2.1.201 ([#91](https://github.com/inference-gateway/adl/issues/91)) ([1e87301](https://github.com/inference-gateway/adl/commit/1e87301460295d6e2264074dca6367d331a7f9e9))
* **deps:** bump claude-code-action v1.0.165 -> v1.0.169 ([#99](https://github.com/inference-gateway/adl/issues/99)) ([39b7de4](https://github.com/inference-gateway/adl/commit/39b7de46fc5156c9b5cab12155236f4ecdee93ff))
* **deps:** bump infer CLI v0.130.1 -> v0.133.0, infer-action v0.24.0 -> v0.26.0 ([#92](https://github.com/inference-gateway/adl/issues/92)) ([6bac340](https://github.com/inference-gateway/adl/commit/6bac340e2d845f960c87d20405cd4e70e7a6713d))
* **deps:** bump infer CLI v0.133.0 -> v0.133.1, infer-action v0.26.0 -> v0.27.1 ([#94](https://github.com/inference-gateway/adl/issues/94)) ([9fb56b8](https://github.com/inference-gateway/adl/commit/9fb56b88f53c32c67f431dbd96d62fa6beb7e72e))
* **deps:** bump infer CLI v0.133.1 -> v0.137.0, infer-action v0.27.1 -> v0.29.0 ([#95](https://github.com/inference-gateway/adl/issues/95)) ([e461552](https://github.com/inference-gateway/adl/commit/e46155254ab2d97dfc418c78f15fe65a5fffbccc))
* **deps:** bump infer CLI v0.137.0 -> v0.138.0, infer-action v0.29.0 -> v0.30.1 ([#96](https://github.com/inference-gateway/adl/issues/96)) ([25b2cfc](https://github.com/inference-gateway/adl/commit/25b2cfc6054f0d8c5fde23a3b4220ace4aa7a519))
* **deps:** bump infer CLI v0.138.0 -> v0.141.0 ([#101](https://github.com/inference-gateway/adl/issues/101)) ([17c968a](https://github.com/inference-gateway/adl/commit/17c968a1b4e4704a08947dc105e32d66565ec415))
* **deps:** bump inference-gateway/.github/.github/workflows/infer.yml ([#93](https://github.com/inference-gateway/adl/issues/93)) ([2b8b79b](https://github.com/inference-gateway/adl/commit/2b8b79b29fa43ae9aaf411d33e048fc53b8735f1))

## [0.18.0](https://github.com/inference-gateway/adl/compare/v0.17.0...v0.18.0) (2026-07-05)

## [0.17.0](https://github.com/inference-gateway/adl/compare/v0.16.1...v0.17.0) (2026-07-05)

## [0.16.1](https://github.com/inference-gateway/adl/compare/v0.16.0...v0.16.1) (2026-06-23)

### 👷 CI

* **deps:** upgrade actions/checkout from v6.0.3 to v7.0.0 across workflows ([dbe9abe](https://github.com/inference-gateway/adl/commit/dbe9abe6af18eccda0f0709e305c87f7e5770358))
* **infer:** centralize infer.yml + sync .infer config ([#76](https://github.com/inference-gateway/adl/issues/76)) ([4e1c2df](https://github.com/inference-gateway/adl/commit/4e1c2df64d94d2f64644a98faa01dba1beff4e38))

### 📚 Documentation

* add development sandbox and config/telemetry examples ([#79](https://github.com/inference-gateway/adl/issues/79)) ([749b1b1](https://github.com/inference-gateway/adl/commit/749b1b11bd89abf74dac28356a2562e97c566f39))

### 🔧 Miscellaneous

* add permissions for reading contents in workflow ([17932a6](https://github.com/inference-gateway/adl/commit/17932a6cbfc86d3b96658c333db1e19c3ce3a1d9))
* **deps:** bump claude-code-action v1.0.150 -> v1.0.152 ([#75](https://github.com/inference-gateway/adl/issues/75)) ([bcd1d65](https://github.com/inference-gateway/adl/commit/bcd1d65c5cc16b768149070340a9be860088abe3))
* **deps:** bump infer CLI v0.121.1 -> v0.122.2, infer-action v0.15.1 -> v0.15.4 ([#77](https://github.com/inference-gateway/adl/issues/77)) ([6089653](https://github.com/inference-gateway/adl/commit/6089653e33294d5637606fb3e86da801bb02282d))
* **deps:** bump inference-gateway/.github/.github/workflows/claude.yml ([#78](https://github.com/inference-gateway/adl/issues/78)) ([d33371f](https://github.com/inference-gateway/adl/commit/d33371fca13538626d2136dcbbdd8fc533d1d649))
* **deps:** update schema version and bump codex version to ^0.139.0 in manifest files ([d6d2357](https://github.com/inference-gateway/adl/commit/d6d2357e3fc6ea5e59688d3bd4006f55ac6b5ee0))
* **infer:** remove default configuration ([b1f75a8](https://github.com/inference-gateway/adl/commit/b1f75a892ef4cf51e1226728fc3374b528f6b399))

## [0.16.0](https://github.com/inference-gateway/adl/compare/v0.15.1...v0.16.0) (2026-06-18)

### ✨ Features

* add cloudflare workers deployment target ([#74](https://github.com/inference-gateway/adl/issues/74)) ([01dd4e6](https://github.com/inference-gateway/adl/commit/01dd4e67afb81f0b53d1e2ecb2a87934280e237a)), closes [#57](https://github.com/inference-gateway/adl/issues/57)

### 👷 CI

* centralize claude.yml via reusable workflow ([#67](https://github.com/inference-gateway/adl/issues/67)) ([b99427c](https://github.com/inference-gateway/adl/commit/b99427cefee42c636f40a6065a7d1b5ab357c59b))

### 🔧 Miscellaneous

* **deps:** bump claude-code 2.1.161 -> 2.1.170, claude-code-action v1.0.135 -> v1.0.142 ([#68](https://github.com/inference-gateway/adl/issues/68)) ([1a8c233](https://github.com/inference-gateway/adl/commit/1a8c233d37bf80425c3e93bea4fdcc774d9d3afe))
* **deps:** bump claude-code 2.1.170 -> 2.1.177, claude-code-action v1.0.142 -> v1.0.150 ([#71](https://github.com/inference-gateway/adl/issues/71)) ([f30b63d](https://github.com/inference-gateway/adl/commit/f30b63d2744efe8ce75a1e4e0b914ef7451b447f))
* **deps:** bump infer CLI v0.121.0 -> v0.121.1, infer-action v0.12.1 -> v0.13.1 ([#69](https://github.com/inference-gateway/adl/issues/69)) ([3e58be8](https://github.com/inference-gateway/adl/commit/3e58be887aeb3b48de40ce0e19517d49fbcbb3ac))
* **deps:** bump infer-action v0.11.7 -> v0.12.1 ([#66](https://github.com/inference-gateway/adl/issues/66)) ([cc96104](https://github.com/inference-gateway/adl/commit/cc96104bb6f9e5640b67c1c611e3de9ffa39c262))
* **deps:** bump infer-action v0.13.1 -> v0.15.1 ([#73](https://github.com/inference-gateway/adl/issues/73)) ([0f62856](https://github.com/inference-gateway/adl/commit/0f6285641101204b12d0d2741b2de5f2c8db0918))

## [0.15.1](https://github.com/inference-gateway/adl/compare/v0.15.0...v0.15.1) (2026-06-09)

### 🔧 Miscellaneous

* **deps:** bump claude-code 2.1.158 -> 2.1.161, claude-code-action v1.0.133 -> v1.0.135 ([#63](https://github.com/inference-gateway/adl/issues/63)) ([a4ccfde](https://github.com/inference-gateway/adl/commit/a4ccfde36e18736b131edd9a639bc34bb0f98d85))
* **deps:** bump codex 0.133.0 -> 0.135.0 ([#58](https://github.com/inference-gateway/adl/issues/58)) ([9734097](https://github.com/inference-gateway/adl/commit/9734097ed55eb3f001a4936ef20f01e5ae9f5541))
* **deps:** bump infer CLI v0.117.1 -> v0.119.0, infer-action v0.11.2 -> v0.11.4 ([#59](https://github.com/inference-gateway/adl/issues/59)) ([f41e5a3](https://github.com/inference-gateway/adl/commit/f41e5a3ae432e9f37951d2805e5beffffacb8001))
* **deps:** bump infer CLI v0.119.0 -> v0.120.0, infer-action v0.11.4 -> v0.11.6 ([#60](https://github.com/inference-gateway/adl/issues/60)) ([7820728](https://github.com/inference-gateway/adl/commit/782072821fdce0353bec74e5ef0148cc0e320a9b))
* **deps:** bump infer CLI v0.120.0 -> v0.120.1, infer-action v0.11.6 -> v0.11.7 ([#61](https://github.com/inference-gateway/adl/issues/61)) ([103326f](https://github.com/inference-gateway/adl/commit/103326f96feeefd5739e6b4754c7ee3ef0f2a287))
* **deps:** bump infer CLI v0.120.1 -> v0.121.0 ([#65](https://github.com/inference-gateway/adl/issues/65)) ([f34b39e](https://github.com/inference-gateway/adl/commit/f34b39e8ddcd9be3a7ce5e0aee88ce5bc3ed5f75))
* **deps:** bump infer-action v0.11.1 -> v0.11.2 ([#56](https://github.com/inference-gateway/adl/issues/56)) ([37083f0](https://github.com/inference-gateway/adl/commit/37083f09620444faa07ed02a4b7a2f86cb2bfffe))

## [0.15.0](https://github.com/inference-gateway/adl/compare/v0.14.0...v0.15.0) (2026-06-03)

### ✨ Features

* add cohere, cloudflare, moonshot, ollama_cloud providers ([#55](https://github.com/inference-gateway/adl/issues/55)) ([1ec1174](https://github.com/inference-gateway/adl/commit/1ec1174461f08d68d8dde574bf2734b07d534fbf))

### 👷 CI

* centralize claude.yml via reusable workflow ([#51](https://github.com/inference-gateway/adl/issues/51)) ([56e3be4](https://github.com/inference-gateway/adl/commit/56e3be46528607198744ec2ffda599ee819eb13a))

### 🔧 Miscellaneous

* **deps:** bump claude-code 2.1.148 -> 2.1.158 ([#50](https://github.com/inference-gateway/adl/issues/50)) ([935f9a2](https://github.com/inference-gateway/adl/commit/935f9a2f49600a05de552559fc4c34cab9882b40))

## [0.14.0](https://github.com/inference-gateway/adl/compare/v0.13.0...v0.14.0) (2026-06-03)

### ✨ Features

* add spec.telemetry.enabled to toggle opentelemetry ([#41](https://github.com/inference-gateway/adl/issues/41)) ([73d6971](https://github.com/inference-gateway/adl/commit/73d6971d51ffff5e5dc124907fd27bbae98b816b))

## [0.13.0](https://github.com/inference-gateway/adl/compare/v0.12.0...v0.13.0) (2026-06-02)

### ✨ Features

* add vercel as a deployment strategy (spec.deployment.type: vercel) ([#48](https://github.com/inference-gateway/adl/issues/48)) ([b1e74cd](https://github.com/inference-gateway/adl/commit/b1e74cd0c07c173f6d5efcffda697d2893d43d10))

### 👷 CI

* centralize claude.yml via reusable workflow ([#42](https://github.com/inference-gateway/adl/issues/42)) ([1227996](https://github.com/inference-gateway/adl/commit/12279964409af696be8f2b543b67d3755163dd7a))
* centralize infer.yml + bump infer CLI and sync .infer config ([#46](https://github.com/inference-gateway/adl/issues/46)) ([70dc60a](https://github.com/inference-gateway/adl/commit/70dc60a9a3e56a42d8830cb8411861b4f2085ea5))
* centralize infer.yml + sync .infer config ([#44](https://github.com/inference-gateway/adl/issues/44)) ([0db8d7a](https://github.com/inference-gateway/adl/commit/0db8d7a8c3024a2f49a4875e3bfbda26db4f6ef9))
* centralize infer.yml via reusable workflow ([#43](https://github.com/inference-gateway/adl/issues/43)) ([b6c5477](https://github.com/inference-gateway/adl/commit/b6c54779221a7590d19d5db465e4836628e3ff36))
* **infer:** centralize infer.yml + bump infer CLI and sync .infer config ([#47](https://github.com/inference-gateway/adl/issues/47)) ([2de1bf8](https://github.com/inference-gateway/adl/commit/2de1bf81ffa40d298c7199ef571a082887a08c01))

### 📚 Documentation

* add manifest-to-running-agent quickstart guide ([#38](https://github.com/inference-gateway/adl/issues/38)) ([196a3ed](https://github.com/inference-gateway/adl/commit/196a3ed969a50ce53ad00849c6c7f60f942b0ae6))
* add no-LLM, services, deployment, skills, MCP examples ([#36](https://github.com/inference-gateway/adl/issues/36)) ([9953689](https://github.com/inference-gateway/adl/commit/995368921a0334ab1e4017b9b16ba77be71d7cd0))
* add terminology glossary for cross-cutting concepts ([#37](https://github.com/inference-gateway/adl/issues/37)) ([d4ad470](https://github.com/inference-gateway/adl/commit/d4ad4709f7a18537091800656bdabb6c9d7d772e))
* document secrets and env-var interpolation ([#39](https://github.com/inference-gateway/adl/issues/39)) ([4dc57b5](https://github.com/inference-gateway/adl/commit/4dc57b58e186d99916f85855e5b3b221cddbcf75))
* explain the A2A protocol and how capabilities/card map to it ([#40](https://github.com/inference-gateway/adl/issues/40)) ([11abb9a](https://github.com/inference-gateway/adl/commit/11abb9a83f446ef0120f1a2d9bdbf5a2fe808c13))

### 🔧 Miscellaneous

* add infer.yml to prettier ignore list ([acf7758](https://github.com/inference-gateway/adl/commit/acf77584f00034a6e5a76f3720fc1c822d6cd359))
* **deps:** bump infer CLI v0.117.0 -> v0.117.1, infer-action v0.9.1 -> v0.11.1 ([#49](https://github.com/inference-gateway/adl/issues/49)) ([9c16ea5](https://github.com/inference-gateway/adl/commit/9c16ea56a78a264d8a38c2625b033cafcf45420f))

## [0.12.0](https://github.com/inference-gateway/adl/compare/v0.11.0...v0.12.0) (2026-05-30)

### ✨ Features

* **schema:** add MCP server config to spec.agent ([#28](https://github.com/inference-gateway/adl/issues/28)) ([9fa7101](https://github.com/inference-gateway/adl/commit/9fa71018962fa6d645ed792ced0c634e05f676c5))

### ♻️ Improvements

* **schema:** nest dev AI providers under ai.orchestrators ([#27](https://github.com/inference-gateway/adl/issues/27)) ([bfdf46c](https://github.com/inference-gateway/adl/commit/bfdf46c7414d67b940dcc119a87f702f5269f383))

### 🐛 Bug Fixes

* **docs:** clarify skills vs tools ([633f116](https://github.com/inference-gateway/adl/commit/633f116dad27f2a9556d209562c50639479cf526))

### 👷 CI

* centralize claude.yml via reusable workflow ([#29](https://github.com/inference-gateway/adl/issues/29)) ([b3a1cd1](https://github.com/inference-gateway/adl/commit/b3a1cd120feb535896ab07d94c6cbb56bb6c3fd2))
* centralize claude.yml via reusable workflow ([#30](https://github.com/inference-gateway/adl/issues/30)) ([b46ad44](https://github.com/inference-gateway/adl/commit/b46ad448873219635b2c94f1fd5a9329f52ad57d))
* **claude:** download all maintainer skill assets ([843193b](https://github.com/inference-gateway/adl/commit/843193bfea306d95da843e4fdcd99d3a4304b906))
* **claude:** restore valid effort level and fix node-version input ([#26](https://github.com/inference-gateway/adl/issues/26)) ([6d52e87](https://github.com/inference-gateway/adl/commit/6d52e8777fcead2715366e67eab9ffe716cb8ddd))
* **claude:** standardize workflow + task-based branch prefix ([c9863ab](https://github.com/inference-gateway/adl/commit/c9863abb48884c4bca16390467a6670ad8aa60a3))

### 📚 Documentation

* fix formatting ([dfb99e1](https://github.com/inference-gateway/adl/commit/dfb99e12d1605573fdf7204016a9877ae894d54a))

### 🎨 Miscellaneous

* improve icons ([ecc6a47](https://github.com/inference-gateway/adl/commit/ecc6a474e15c939db8ebb86fd8a03b877927e4df))
* use proper icons ([4e1e402](https://github.com/inference-gateway/adl/commit/4e1e402e5312001220051d427ef5fbde08570270))

## [0.11.0](https://github.com/inference-gateway/adl/compare/v0.10.0...v0.11.0) (2026-05-26)

### ✨ Features

* **docs:** Add social preview image and favicon ([c286f42](https://github.com/inference-gateway/adl/commit/c286f42c576fe9fb147ff0176689f8d15816d14a))
* **docs:** Add VitePress documentation site under docs/ ([#21](https://github.com/inference-gateway/adl/issues/21)) ([bc3bddb](https://github.com/inference-gateway/adl/commit/bc3bddb5c2f7adb496de331f376a3939ff18ff1b)), closes [#18](https://github.com/inference-gateway/adl/issues/18)
* **schema:** Add optional author, license, and tags to Metadata ([#20](https://github.com/inference-gateway/adl/issues/20)) ([0c192d2](https://github.com/inference-gateway/adl/commit/0c192d2dad4f3b2e3a0ad19e01aebe2a53b469b8)), closes [#19](https://github.com/inference-gateway/adl/issues/19)

### ♻️ Improvements

* Remove fictional feature ([96b6484](https://github.com/inference-gateway/adl/commit/96b648486bd0a7cc35988ec5b735c76cac9690c2))

### 🐛 Bug Fixes

* **ci:** Assets not served ([a571735](https://github.com/inference-gateway/adl/commit/a5717350c66fe9fa88109afe6c7e729e5bdd4e63))
* **docs:** move v1 page into v1/index.md to fix SPA navigation ([#23](https://github.com/inference-gateway/adl/issues/23)) ([49410e8](https://github.com/inference-gateway/adl/commit/49410e806f88479884ccfc117b56a66e48ca0388))

### 👷 CI

* Add deploy workflow ([fa819be](https://github.com/inference-gateway/adl/commit/fa819be77923f797c77230716062293ddc519619))
* Add format check ([c57f869](https://github.com/inference-gateway/adl/commit/c57f869425b5f576f06f5380ca56446a38ec43fc))
* **claude:** add playwright mcp server so claude can verify frontend fixes ([e8252b2](https://github.com/inference-gateway/adl/commit/e8252b2ad977d73e07841c725389d458bcdb5358))
* **claude:** remove custom system prompt ([7ffa311](https://github.com/inference-gateway/adl/commit/7ffa3118a4ff0e616486af8e3f3ce5fa7f2fa2e9))
* **claude:** set effort to max ([cf8e0b0](https://github.com/inference-gateway/adl/commit/cf8e0b040cd261a3564f44837779a4558034df21))
* **claude:** use unified config instead of inline instructions ([9ef2f61](https://github.com/inference-gateway/adl/commit/9ef2f618cb91154b54300e40af98310332ea9386))
* **deps:** Bump claude-code-action  v1.0.131 -> v1.0.133 ([38eb72b](https://github.com/inference-gateway/adl/commit/38eb72b9cdb46c15da1323cb7c7c55ecaf492620))

### 🔧 Miscellaneous

* Add codex ([b361650](https://github.com/inference-gateway/adl/commit/b36165061b67d9a832d89cfae14f58729389548a))
* Add robot.txt ([c579177](https://github.com/inference-gateway/adl/commit/c57917776171d093ed1a97bb4c0e978887aa9701))
* Add v1 schema ([fe2e8d8](https://github.com/inference-gateway/adl/commit/fe2e8d8a968b0657a87630fb6e653038c36efa27))
* Delete AGENTS.md ([3cacab1](https://github.com/inference-gateway/adl/commit/3cacab1ede74e336057803476bf2a704365d0510))
* **deps:** Bump claude-code version ^2.1.141 -> ^2.1.148 ([9f130d6](https://github.com/inference-gateway/adl/commit/9f130d667e20d99202d26b6da0f1816b5851321f))
* **docs:** Generate AGENTS.md file ([439a4aa](https://github.com/inference-gateway/adl/commit/439a4aab637ec8a7db0bcfe37f0384c2a30bd446))
* Exclude README.md from deployment ([4be4402](https://github.com/inference-gateway/adl/commit/4be4402c55190b54a84c1add2c2920f17ad9eab4))
* Fix formatting ([a9c6586](https://github.com/inference-gateway/adl/commit/a9c6586cd3592f7547f9806b64633ade48204ff0))
* **flox:** Bump dev dependecies ([8a4bdd3](https://github.com/inference-gateway/adl/commit/8a4bdd342489ceeadacaa7a69a62c77ba6854775))
* **flox:** Bump schema version ([a4778c2](https://github.com/inference-gateway/adl/commit/a4778c265cfb2f11b919068275cfbc27cb33ec6d))
* Generate CLAUDE.md file ([5b8a9dc](https://github.com/inference-gateway/adl/commit/5b8a9dc76f6230561ce9a5b1f16665c230e6f235))
* Regenerate AGENTS.md with codex ([c37d0e1](https://github.com/inference-gateway/adl/commit/c37d0e189966dad75b0ced940c810ff4bd14f533))
* Remove CLAUDE.md file ([0354f34](https://github.com/inference-gateway/adl/commit/0354f349fe94a77d77be6c48b772fe21ad78e872))
* Remove gitignore rule for package-lock.json ([40e15e1](https://github.com/inference-gateway/adl/commit/40e15e1ebbb30f73988043f531c5c67114624185))
* Replace all em dashes with normal dashes ([5676bc8](https://github.com/inference-gateway/adl/commit/5676bc8ac0ed03dbe7f4f68c26b883d31f210a14))
* Replace em dashes with normal dashes ([14cc642](https://github.com/inference-gateway/adl/commit/14cc642cf455f4913d7c710180c576e7fc2dfa90))
* Run infer init for improved init prompt ([ef217df](https://github.com/inference-gateway/adl/commit/ef217dfde580d348378ec5d2e59d6acb18ef24a0))

## [0.10.0](https://github.com/inference-gateway/adl/compare/v0.9.0...v0.10.0) (2026-05-23)

### ✨ Features

* Add spec.development.deps for sandbox-level dependencies ([#17](https://github.com/inference-gateway/adl/issues/17)) ([11c2f4f](https://github.com/inference-gateway/adl/commit/11c2f4fe3e4231369b1ca39215de0bfdbd07bc6e)), closes [#15](https://github.com/inference-gateway/adl/issues/15)

## [0.9.0](https://github.com/inference-gateway/adl/compare/v0.8.0...v0.9.0) (2026-05-23)

### ✨ Features

* **schema:** Add optional vendor.deps and vendor.devdeps to language configs ([#14](https://github.com/inference-gateway/adl/issues/14)) ([5a28d5a](https://github.com/inference-gateway/adl/commit/5a28d5a71442e2f9fce1435a56c2058126d326cb)), closes [#13](https://github.com/inference-gateway/adl/issues/13)

### 🔧 Miscellaneous

* **license:** Update license to Apache 2.0 ([e62879e](https://github.com/inference-gateway/adl/commit/e62879ef61d33ce25c42c60da3b143af8caedf4d))

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
