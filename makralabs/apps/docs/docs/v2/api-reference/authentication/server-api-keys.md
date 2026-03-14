# Server API Keys

Makra API keys authenticate server-to-server requests and should never be exposed to browsers or mobile clients.

## Required header

```http
Authorization: Bearer <MAKRA_API_KEY>
```

## Example request

```bash
curl https://api.makra.dev/v1/responses \
  -H "Authorization: Bearer $MAKRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-mini",
    "input": "List the checks for a safe production rollout."
  }'
```

## Key management guidance

- Scope keys to the minimum permissions required.
- Rotate keys regularly.
- Separate keys by environment.
- Never print raw keys in logs.

## Failure modes

Requests typically fail with `401` when the key is missing, malformed, or not valid for the selected environment.
