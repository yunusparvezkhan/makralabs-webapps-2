# Webhooks

Webhooks let Makra notify your system about events like ingestion completion or evaluation results.

## Events

- `bundle.created`
- `memory.appended`
- `trace.completed`

## Signature verification

Always verify signatures before accepting a webhook.

## Retries

Expect retries. Handlers should be idempotent.
