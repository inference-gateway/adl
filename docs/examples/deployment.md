# Deployment Targets

[`spec.deployment`](/reference/deployment) tells the generator where the
agent ships. You pick one target with `type` and fill in the matching
sub-block. Both supported targets are shown below as complete,
copy-pasteable manifests for the same agent.

## Kubernetes

The Kubernetes block is intentionally minimal in v1: it carries the
container `image` and leaves the Deployment, Service, and ConfigMap to
the generator's templating.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: analytics-agent
  description: Analytics agent deployed to Kubernetes from GHCR
  version: "2.1.0"
spec:
  capabilities:
    streaming: true
    pushNotifications: false
    stateTransitionHistory: false

  agent:
    provider: anthropic
    model: claude-sonnet-4-7

  server:
    port: 8080
    scheme: https

  language:
    go:
      module: github.com/example/analytics-agent
      version: "1.26"

  deployment:
    type: kubernetes
    kubernetes:
      image:
        registry: ghcr.io
        repository: example/analytics-agent
        tag: v2.1.0
```

## Cloud Run

The same agent, retargeted at Cloud Run. The `cloudrun` block adds typed
slots for resources, autoscaling, and service settings, and can opt into
Google Cloud Build with `useCloudBuild: true`.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: analytics-agent
  description: Analytics agent deployed to Cloud Run with Cloud Build
  version: "2.1.0"
spec:
  capabilities:
    streaming: true
    pushNotifications: false
    stateTransitionHistory: false

  agent:
    provider: anthropic
    model: claude-sonnet-4-7

  server:
    port: 8080
    scheme: https

  language:
    go:
      module: github.com/example/analytics-agent
      version: "1.26"

  deployment:
    type: cloudrun
    cloudrun:
      image:
        registry: us-central1-docker.pkg.dev
        repository: my-project/agents/analytics-agent
        tag: v2.1.0
        useCloudBuild: true
      resources:
        cpu: "2"
        memory: 1Gi
      scaling:
        minInstances: 0
        maxInstances: 20
        concurrency: 40
      service:
        timeout: 600
        allowUnauthenticated: false
        serviceAccount: analytics@my-project.iam.gserviceaccount.com
        executionEnvironment: gen2
      environment:
        LOG_LEVEL: info
        CACHE_TTL: "300"
```

## Vercel

The same agent, retargeted at Vercel. Unlike `kubernetes` and
`cloudrun`, Vercel deploys from source via its own build pipeline --
there is no prebuilt container image.

```yaml
apiVersion: adl.inference-gateway.com/v1
kind: Agent
metadata:
  name: analytics-agent
  description: Analytics agent deployed to Vercel
  version: "2.1.0"
spec:
  capabilities:
    streaming: true
    pushNotifications: false
    stateTransitionHistory: false

  agent:
    provider: anthropic
    model: claude-sonnet-4-7

  server:
    port: 8080
    scheme: https

  language:
    typescript:
      packageName: analytics-agent
      nodeVersion: "20"

  deployment:
    type: vercel
    vercel:
      project: analytics-agent
      team: acme
      runtime: nodejs
      regions: [iad1]
      functions:
        memory: 1024
        maxDuration: 60
      environment:
        LOG_LEVEL: info
```

## Highlights

- **`type` selects one target.** Set it to
  [`kubernetes`](/reference/deployment#kubernetes),
  [`cloudrun`](/reference/deployment#cloud-run), or
  [`vercel`](/reference/deployment#vercel); the generator reads the
  matching sub-block and ignores the other.
- **`kubernetes` and `cloudrun` share the `image` shape.** Both targets
  reuse the same [`image`](/reference/deployment#image) object
  (`registry`, `repository`, `tag`, `useCloudBuild`).
- **Vercel deploys from source, not from an image.** There is no
  `image` sub-block; Vercel manages its own build pipeline via the
  project's framework and root directory.
- **Cloud Run carries more knobs.** `resources`, `scaling`, and
  `service` give Cloud Run typed control over CPU/memory, instance
  counts, and request handling. `scaling.minInstances: 0` lets it scale
  to zero when idle.
- **Kubernetes stays lean on purpose.** v1 keeps it to the image so the
  generator's templates own replica counts and limits. Future minor
  versions may add typed slots as patterns harden.
