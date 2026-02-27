# Quickstart

This quickstart builds a tiny AI chat endpoint that:

1. Stores messages to Makra
2. Retrieves a context bundle for each turn
3. Calls your model provider with clean context (not a giant transcript)

## 1) Install the SDK

Install the Python SDK:

```python
# python -m pip install makra-sdk
```

## 2) Configure environment variables

Create `.env.local`:

```python
import os

os.environ["MAKRA_API_KEY"] = "mk_live_..."
os.environ["MAKRA_WORKSPACE"] = "acme-dev"
os.environ["MODEL_PROVIDER_API_KEY"] = "..."
```

## 3) Create a client

```python
from makra import Makra

makra = Makra(
    api_key=os.environ["MAKRA_API_KEY"],
    workspace=os.environ["MAKRA_WORKSPACE"],
)
```

## 4) Write chat turns to a session

```python
makra.sessions.upsert(session_id="user_123")

makra.memories.append(
    session_id="user_123",
    items=[
        {"type": "message", "role": "user", "content": "I like answers in bullets."},
        {"type": "message", "role": "assistant", "content": "Got it."},
    ],
)
```

## 5) Retrieve a bundle and call your model

```python
bundle = makra.bundles.create(
    session_id="user_123",
    intent="Answer the user question with their formatting preference.",
    max_tokens=1200,
)

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    *bundle.to_messages(),
    {"role": "user", "content": "What is a vector database?"},
]
```

## 6) Return citations

Makra bundles include source ids and spans. Attach them to your UI so users can trust answers:

```python
return {
    "answer": model_answer,
    "citations": bundle.citations,
}
```

## Troubleshooting

- If your bundle is empty, confirm your workspace and session id match.
- If a response is too long, reduce `maxTokens` or tighten `intent`.
