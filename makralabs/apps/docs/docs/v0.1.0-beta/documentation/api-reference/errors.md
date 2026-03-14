# Errors

Makra v1 returns structured errors with a stable code, a human-readable message, and a request identifier.

## Typical handling

- Retry transient network failures.
- Log request ids.
- Surface clear validation messages to users.
