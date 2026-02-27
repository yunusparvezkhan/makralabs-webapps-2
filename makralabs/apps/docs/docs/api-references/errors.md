# Errors

Makra errors are structured and intended to drive actionable retries and UX.

## Error shape

```python
err = {
    "error": {
        "code": "rate_limit_exceeded",
        "message": "Too many requests.",
        "requestId": "req_...",
    }
}
```

## Common codes

- `invalid_request`: Missing/invalid parameters
- `unauthorized`: Missing/invalid credentials
- `not_found`: Unknown session/document id
- `rate_limit_exceeded`: Back off and retry
