# REST API

Makra’s REST API is designed for predictable, idempotent writes and fast reads.

## Conventions

- JSON request/response bodies
- Cursor pagination on list endpoints
- Idempotency keys for writes (recommended)

## Example: list sessions

```python
import os
import requests

resp = requests.get(
    "https://api.makra.example/v1/sessions",
    params={"limit": 20, "cursor": "..."},
    headers={"Authorization": f"Bearer {os.environ['MAKRA_API_KEY']}"},
)
resp.raise_for_status()
print(resp.json())
```

## Example: append memories

```python
payload = {
    "items": [
        {"type": "message", "role": "user", "content": "Remember my preference: bullets."},
    ]
}

resp = requests.post(
    "https://api.makra.example/v1/sessions/user_123/memories",
    json=payload,
    headers={
        "Authorization": f"Bearer {os.environ['MAKRA_API_KEY']}",
        "Idempotency-Key": "1c4d...",
    },
)
resp.raise_for_status()
print(resp.json())
```
