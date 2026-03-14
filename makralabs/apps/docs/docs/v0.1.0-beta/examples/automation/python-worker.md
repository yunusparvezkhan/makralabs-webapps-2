# Python Worker

Python workers are a practical way to keep legacy ingestion and routing flows stable while still using Makra for language tasks.

## Checklist

- Make jobs idempotent.
- Store request ids.
- Retry from the queue layer.
