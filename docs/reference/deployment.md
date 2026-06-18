# `spec.deployment`

Where and how the agent ships in production. Pick a target with `type`,
then configure the matching sub-block.

```yaml
spec:
  deployment:
    type: kubernetes
    kubernetes:
      image:
        registry: ghcr.io
        repository: company/customer-support-agent
        tag: v1.0.0
```

## Fields

| Field        | Type     | Required | Description                                                                            |
| ------------ | -------- | :------: | -------------------------------------------------------------------------------------- |
| `type`       | `string` |          | enum: `kubernetes`, `cloudrun`, `vercel`, `cloudflare`. Selects the deployment target. |
| `kubernetes` | `object` |          | See [Kubernetes](#kubernetes).                                                         |
| `cloudrun`   | `object` |          | See [Cloud Run](#cloud-run).                                                           |
| `vercel`     | `object` |          | See [Vercel](#vercel).                                                                 |
| `cloudflare` | `object` |          | See [Cloudflare](#cloudflare).                                                         |

## Kubernetes {#kubernetes}

```yaml
spec:
  deployment:
    type: kubernetes
    kubernetes:
      image:
        registry: ghcr.io
        repository: company/customer-support-agent
        tag: v1.0.0
```

| Field   | Description          |
| ------- | -------------------- |
| `image` | See [Image](#image). |

The Kubernetes block is intentionally minimal in v1 - it carries the
**image** and leaves the rest (Deployment, Service, ConfigMap, …) to
the generator's templating. Future minor versions may add typed slots
for replica counts and resource limits as common patterns harden.

## Cloud Run {#cloud-run}

```yaml
spec:
  deployment:
    type: cloudrun
    cloudrun:
      image:
        registry: us-central1-docker.pkg.dev
        repository: my-project/agents/customer-support
        tag: v1.0.0
        useCloudBuild: true
      resources:
        cpu: "1"
        memory: 512Mi
      scaling:
        minInstances: 1
        maxInstances: 10
        concurrency: 80
      service:
        timeout: 300
        allowUnauthenticated: false
        serviceAccount: agents@my-project.iam.gserviceaccount.com
        executionEnvironment: gen2
      environment:
        LOG_LEVEL: info
        CACHE_TTL: "300"
```

| Field         | Reference                               |
| ------------- | --------------------------------------- |
| `image`       | [Image](#image)                         |
| `resources`   | [Resources](#cloud-run-resources)       |
| `scaling`     | [Scaling](#cloud-run-scaling)           |
| `service`     | [Service](#cloud-run-service)           |
| `environment` | `{ [key: string]: string }` - env vars. |

`environment` is injected into the running service and commonly carries
both configuration and secrets. Never inline a real secret here -
reference it with a `${VAR}` placeholder and let your deploy pipeline
supply the value. See [Secrets & interpolation](./secrets). (The
`kubernetes` target has no `environment` map of its own; the generator's
templating owns the Deployment's `env` / `envFrom`.)

### Resources {#cloud-run-resources}

| Field    | Type     | Description                                |
| -------- | -------- | ------------------------------------------ |
| `cpu`    | `string` | CPU allocation per instance (e.g. `"1"`).  |
| `memory` | `string` | Memory per instance (e.g. `512Mi`, `2Gi`). |

### Scaling {#cloud-run-scaling}

| Field          | Type      | Description                              |
| -------------- | --------- | ---------------------------------------- |
| `minInstances` | `integer` | Minimum number of instances kept warm.   |
| `maxInstances` | `integer` | Cap on instances Cloud Run may spin up.  |
| `concurrency`  | `integer` | Concurrent requests served per instance. |

### Service {#cloud-run-service}

| Field                  | Type      | Description                                            |
| ---------------------- | --------- | ------------------------------------------------------ |
| `timeout`              | `integer` | Per-request timeout in seconds.                        |
| `allowUnauthenticated` | `boolean` | If `true`, the service is publicly invokable.          |
| `serviceAccount`       | `string`  | GCP service-account email the service runs as.         |
| `executionEnvironment` | `string`  | Cloud Run execution environment (e.g. `gen1`, `gen2`). |

## Vercel {#vercel}

```yaml
spec:
  deployment:
    type: vercel
    vercel:
      project: customer-support-agent
      team: acme
      runtime: nodejs
      regions: [iad1]
      functions:
        memory: 1024
        maxDuration: 60
      environment:
        LOG_LEVEL: info
```

| Field         | Reference                                                                 |
| ------------- | ------------------------------------------------------------------------- |
| `project`     | `string` - Vercel project name.                                           |
| `team`        | `string` - Vercel team ID or slug the project belongs to.                 |
| `framework`   | `string` - Framework identifier (e.g. `nextjs`). Omit for auto-detection. |
| `runtime`     | `string` - enum: `nodejs`, `edge`. Vercel function runtime.               |
| `regions`     | `string[]` - Region identifiers (e.g. `iad1`).                            |
| `functions`   | `object` - [Functions](#vercel-functions) configuration.                  |
| `environment` | `{ [key: string]: string }` - Environment variables.                      |

Unlike `kubernetes` and `cloudrun` which deploy a prebuilt container
image, Vercel deploys from source via its own build pipeline. There is
no `image` sub-block – the build is managed by Vercel based on the
project's framework and root directory.

`environment` is injected at deploy time and commonly carries both
configuration and secrets. Never inline a real secret here - reference
it with a `${VAR}` placeholder and let your deploy pipeline supply the
value. See [Secrets & interpolation](./secrets).

### Functions {#vercel-functions}

| Field         | Type      | Description                                             |
| ------------- | --------- | ------------------------------------------------------- |
| `memory`      | `integer` | Memory limit per function invocation in MB (e.g. 1024). |
| `maxDuration` | `integer` | Maximum execution time in seconds.                      |

## Cloudflare {#cloudflare}

```yaml
spec:
  deployment:
    type: cloudflare
    cloudflare:
      name: customer-support-agent
      accountId: ${CLOUDFLARE_ACCOUNT_ID}
      compatibilityDate: "2025-01-01"
      compatibilityFlags: [nodejs_compat]
      routes:
        - agent.example.com/*
      workersDev: false
      environment:
        LOG_LEVEL: info
```

| Field                | Reference                                                          |
| -------------------- | ------------------------------------------------------------------ |
| `name`               | `string` - Worker (script) name registered with Cloudflare.        |
| `accountId`          | `string` - Cloudflare account ID. Prefer a `${VAR}` placeholder.   |
| `compatibilityDate`  | `string` - Workers runtime compatibility date (e.g. `2025-01-01`). |
| `compatibilityFlags` | `string[]` - Runtime compatibility flags (e.g. `nodejs_compat`).   |
| `routes`             | `string[]` - Custom routes / domains (e.g. `agent.example.com/*`). |
| `workersDev`         | `boolean` - Expose the Worker on its `*.workers.dev` subdomain.    |
| `environment`        | `{ [key: string]: string }` - Plain-text vars (wrangler `vars`).   |

Like `vercel` and unlike `kubernetes`/`cloudrun`, Cloudflare Workers
deploy from source via wrangler rather than a prebuilt container image,
so there is no `image` sub-block. This target models **Workers** (the
server/serverless product, the right fit for an A2A agent server), not
Pages. Workers always run on the V8-isolate edge runtime, so there is no
`runtime` enum as on Vercel - Node.js API needs are met with the
`nodejs_compat` compatibility flag. `compatibilityDate` is effectively
required by wrangler; when omitted the generator supplies a default.

`environment` carries plain-text wrangler `vars`. Never inline a real
secret here - reference it with a `${VAR}` placeholder, and set true
secrets out-of-band with `wrangler secret put`.
See [Secrets & interpolation](./secrets).

## Image {#image}

Used by the `kubernetes` and `cloudrun` sub-blocks only.

| Field           | Type      | Description                                                                                                   |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| `registry`      | `string`  | Image registry (e.g. `ghcr.io`).                                                                              |
| `repository`    | `string`  | Image repository within the registry.                                                                         |
| `tag`           | `string`  | Image tag.                                                                                                    |
| `useCloudBuild` | `boolean` | If `true`, the generator wires in Google Cloud Build for image production. Most useful with `type: cloudrun`. |
