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

| Field        | Type     | Required | Description                                                    |
| ------------ | -------- | :------: | -------------------------------------------------------------- |
| `type`       | `string` |          | enum: `kubernetes`, `cloudrun`, `vercel`. Selects the deployment target. |
| `kubernetes` | `object` |          | See [Kubernetes](#kubernetes).                                 |
| `cloudrun`   | `object` |          | See [Cloud Run](#cloud-run).                                   |
| `vercel`     | `object` |          | See [Vercel](#vercel).                                         |

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

| Field         | Reference                                                     |
| ------------- | ------------------------------------------------------------- |
| `project`     | `string` - Vercel project name.                               |
| `team`        | `string` - Vercel team ID or slug the project belongs to.     |
| `framework`   | `string` - Framework identifier (e.g. `nextjs`). Omit for auto-detection. |
| `runtime`     | `string` - enum: `nodejs`, `edge`. Vercel function runtime.   |
| `regions`     | `string[]` - Region identifiers (e.g. `iad1`).                |
| `functions`   | `object` - [Functions](#vercel-functions) configuration.       |
| `environment` | `{ [key: string]: string }` - Environment variables.          |

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

## Image {#image}

Used by the `kubernetes` and `cloudrun` sub-blocks only.

| Field           | Type      | Description                                                                                                   |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| `registry`      | `string`  | Image registry (e.g. `ghcr.io`).                                                                              |
| `repository`    | `string`  | Image repository within the registry.                                                                         |
| `tag`           | `string`  | Image tag.                                                                                                    |
| `useCloudBuild` | `boolean` | If `true`, the generator wires in Google Cloud Build for image production. Most useful with `type: cloudrun`. |
