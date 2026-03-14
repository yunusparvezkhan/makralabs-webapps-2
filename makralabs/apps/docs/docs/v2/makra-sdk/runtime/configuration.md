# Configuration

Makra SDK configuration should make behavior explicit across local, staging, and production environments.

## Typical setup

```ts
const makra = createMakraClient({
  apiKey: process.env.MAKRA_API_KEY!,
  baseUrl: process.env.MAKRA_BASE_URL,
  environment: "production",
  timeoutMs: 20_000,
  retries: 2,
});
```

## Configuration areas

### Credentials

Use one credential per environment and rotate them on a predictable schedule.

### Timeouts

Set shorter timeouts for interactive user flows and longer values only for background jobs.

### Retries

Retry transient failures such as transport interruptions and rate limits. Do not retry validation errors.

### Telemetry

Record request ids, latency, status, and model identifiers in logs and traces.

## Best practice

Keep SDK setup in one module so runtime changes can be reviewed in a single place.
