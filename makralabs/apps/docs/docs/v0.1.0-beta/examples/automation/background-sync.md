# Background Sync

Background sync remains a useful pattern in v1 for enrichment and classification tasks that do not need to block the user.

## Workflow

Queue work, call Makra in a worker, persist the result, and capture retry metadata for operational visibility.
