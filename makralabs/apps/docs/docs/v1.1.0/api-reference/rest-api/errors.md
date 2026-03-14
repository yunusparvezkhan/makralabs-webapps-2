# Errors

Makra returns structured errors with stable error codes, human-readable messages, and request identifiers.

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

## Common classes

- `authentication_error`
- `permission_denied`
- `validation_error`
- `rate_limit_exceeded`
- `internal_error`

## Recommended handling

- Retry transient failures with backoff.
- Show actionable copy for validation errors.
- Capture request ids in logs and support tickets.
- Alert on repeated `5xx` responses.
