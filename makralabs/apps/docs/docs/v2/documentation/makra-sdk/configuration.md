# Configuration

Makra SDK configuration controls transport behavior, environment-specific defaults, and application-level guardrails.

## Common options

```ts
const makra = createMakraClient({
  apiKey: process.env.MAKRA_API_KEY!,
  baseUrl: process.env.MAKRA_BASE_URL,
  environment: "production",
  timeoutMs: 20_000,
  retries: 2,
});
```

## Environment strategy

Use explicit environments instead of relying on hidden defaults. This makes telemetry, feature flags, and debugging more predictable across deployments.

## Timeout guidance

- `5s-10s` for low-latency interactive requests
- `15s-30s` for retrieval-heavy workflows
- Higher values only for background jobs

## Retry guidance

Retry transient failures such as network interruptions and `429` responses. Avoid retrying validation errors or malformed input because those failures are deterministic.

## Observability hooks

Instrument request start, request end, and error paths. At minimum, capture request ids, status codes, latency, and model identifiers.

## Security note

Do not expose administrative tokens in browser bundles. Create a thin server route whenever the UI needs Makra-backed operations.
