# Background Sync

Background sync is a strong fit for Makra when the work is useful but does not need to block the user.

## Typical workflow

1. Detect a change in your source system.
2. Queue a sync job with the resource id.
3. Fetch the latest data in a worker.
4. Call Makra for summarization, enrichment, or classification.
5. Persist the result and update sync metadata.

## Job payload

```json
{
  "resource_id": "doc_482",
  "kind": "summary_refresh",
  "requested_by": "system"
}
```

## Best practices

- Keep writes idempotent.
- Record retry counts.
- Alert only after repeated failures.
