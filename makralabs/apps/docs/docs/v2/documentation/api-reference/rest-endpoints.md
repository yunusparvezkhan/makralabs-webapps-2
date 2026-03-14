# REST Endpoints

The REST API exposes consistent resource patterns for responses, agents, sessions, and webhooks.

## Common endpoint groups

- `POST /v1/responses` for one-shot generation
- `POST /v1/agents` for saved agent configuration
- `POST /v1/sessions` for ongoing conversational state
- `POST /v1/webhooks` for delivery configuration

## Response creation example

```http
POST /v1/responses
```

```json
{
  "model": "gpt-5-mini",
  "input": "Draft a rollout checklist for a new SDK release."
}
```

## Typical response shape

```json
{
  "id": "resp_123",
  "status": "completed",
  "output_text": "Start with a canary release, add metrics, and verify fallback behavior."
}
```

## Pagination

List endpoints return stable cursors rather than numeric page indexes. Prefer cursor-based pagination to avoid duplicate or skipped results during concurrent writes.

## Versioning

Use explicit API versions in your client configuration and review changelogs before adopting new response fields.
