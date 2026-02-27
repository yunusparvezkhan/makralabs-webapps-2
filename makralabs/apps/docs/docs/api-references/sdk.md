# SDK (Python)

This page is illustrative. It shows the kind of API reference structure you might maintain in Markdown.

## `new Makra(options)`

```python
import os
from makra import Makra

makra = Makra(
    api_key=os.environ["MAKRA_API_KEY"],
    workspace="acme-dev",
)
```

### Options

- `apiKey` (string, required): Server-side key or service token.
- `workspace` (string, required): Workspace identifier.
- `baseUrl` (string, optional): Override API base URL for local testing.

## Sessions

### `sessions.upsert({ sessionId, metadata? })`

Creates or updates a session.

## Memories

### `memories.append({ sessionId, items })`

Appends memory items to a session.

## Bundles

### `bundles.create({ sessionId, intent, maxTokens })`

Returns a compact context bundle designed for model calls.
