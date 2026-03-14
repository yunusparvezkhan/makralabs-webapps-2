# Python Worker

The Python worker pattern remains useful in v1 for ticket routing, document enrichment, and scheduled classification jobs.

## Good practices

- Keep jobs idempotent.
- Store request ids with job metadata.
- Retry at the queue layer for transient failures.
