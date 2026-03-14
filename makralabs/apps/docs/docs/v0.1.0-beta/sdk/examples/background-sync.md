# Background Sync

Background sync in v1 follows the same high-level design as v2: detect changes, enqueue work, write results back safely.

## Reminder

Avoid placing long-running Makra calls directly in request-response paths when a worker can perform the same work asynchronously.
