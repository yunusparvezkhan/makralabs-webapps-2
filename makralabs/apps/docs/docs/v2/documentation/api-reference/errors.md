# Errors

Makra returns structured error payloads that are safe to log and useful for both UI messaging and operational debugging.

## Error shape

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Request quota exceeded for this workspace.",
    "request_id": "req_abc123"
  }
}
```

## Common error classes

- `authentication_error` when credentials are missing or invalid
- `permission_denied` when the key lacks access
- `rate_limit_exceeded` when request volume exceeds the configured budget
- `validation_error` when payload fields are malformed
- `internal_error` when Makra could not complete the request

## Recommended handling

- Show user-friendly messages for validation failures.
- Retry transient failures with exponential backoff.
- Log request ids for support escalation.
- Alert on repeated `5xx` responses.

## Operational guidance

If an endpoint is part of a background workflow, record both the error code and the last successful checkpoint so jobs can resume safely after recovery.
