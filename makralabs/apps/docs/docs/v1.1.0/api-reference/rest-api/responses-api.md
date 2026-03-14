# Responses API

The Responses API is the main entry point for one-shot generation and structured model output.

## Endpoint

```http
POST /v1/responses
```

## Request example

```json
{
  "model": "gpt-5-mini",
  "input": "Generate a change summary for this release candidate."
}
```

## Response example

```json
{
  "id": "resp_123",
  "status": "completed",
  "output_text": "The release adds session replay, improves retry behavior, and hardens webhook verification."
}
```

## Implementation notes

- Treat response ids as trace anchors in your logs.
- Persist raw payloads only when compliance allows it.
- Normalize output before rendering it in the UI.

## Good defaults

Start with a smaller model for interactive tooling, then move to larger models only when quality demands it.
