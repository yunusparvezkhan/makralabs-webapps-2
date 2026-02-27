# Installation

Makra ships as a lightweight SDK plus an optional local stack for end-to-end development.

## Requirements

- Python 3.10+

## Add the SDK

```python
# python -m pip install makra-sdk
```

## Verify connectivity

Create a quick script:

```python
import os
from makra import Makra

makra = Makra(api_key=os.environ["MAKRA_API_KEY"], workspace="acme-dev")
health = makra.health.check()
print(health)
```

Run it from your app server (never from the browser).

## Recommended project layout

- `src/makra/client.py`: Makra client instance (server-side)
- `src/makra/policies.py`: redaction, allowlists, tool permissions
- `src/routes/chat.py`: your chat endpoint / handler

Put the Makra client in one place, and keep policies (redaction, allowlists, tool permissions) separate from product logic.
