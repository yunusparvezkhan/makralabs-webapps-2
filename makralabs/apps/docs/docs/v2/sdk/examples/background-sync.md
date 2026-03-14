# Background Sync

Background sync jobs help you keep Makra-derived summaries, embeddings, or tags fresh without blocking user-facing requests.

## Recommended workflow

1. Detect content changes in your application.
2. Enqueue a sync job with the resource identifier.
3. Fetch the latest source data in the worker.
4. Write the Makra result back to your storage layer.

## Job payload example

```json
{
  "resource_id": "doc_482",
  "kind": "release_note_summary",
  "requested_by": "system"
}
```

## Best practices

- Make writes idempotent.
- Capture retry counts and failure reasons.
- Alert only after repeated failures, not on the first transient error.
