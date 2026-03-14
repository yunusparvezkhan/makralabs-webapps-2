# Webhooks

Makra webhooks in v1 support asynchronous workflows and downstream automation.

## Handling guidance

- Verify signatures.
- Persist events before heavy processing.
- Keep handlers idempotent so retries are safe.
