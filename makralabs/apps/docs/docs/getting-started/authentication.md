# Authentication

Makra supports simple API keys for development and stronger patterns for production deployments.

## API keys

Use an API key for local development:

```python
import os

os.environ["MAKRA_API_KEY"] = "mk_live_..."
```

Keep keys on the server. Don’t ship them to the browser.

## Service tokens (recommended for production)

For server-to-server use:

- Store a service token in your secret manager
- Rotate on a schedule
- Use separate tokens per environment

## Multi-tenant apps

If your app has multiple customers:

1. Use one workspace per tenant (simplest)
2. Or, use a shared workspace and prefix `sessionId`/`documentId` with your tenant id

In either case, enforce tenant boundaries at your API layer.
