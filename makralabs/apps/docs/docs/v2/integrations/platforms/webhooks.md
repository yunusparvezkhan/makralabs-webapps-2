# Webhooks

Makra webhooks notify your systems when asynchronous work completes or an integration event requires downstream handling.

## Recommended handler design

- Verify signatures before processing.
- Write accepted events to durable storage.
- Move heavy work to a queue or worker.

## Payload example

```json
{
  "type": "response.completed",
  "request_id": "req_123",
  "response_id": "resp_456",
  "created_at": "2026-03-14T10:15:00Z"
}
```

## Retry guidance

Return non-`2xx` only when the event truly failed. Idempotent handlers make retries safe and reduce duplicate side effects.
