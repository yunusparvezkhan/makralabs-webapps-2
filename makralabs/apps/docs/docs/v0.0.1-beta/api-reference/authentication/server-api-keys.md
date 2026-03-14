# Server API Keys

Makra v1 uses bearer-token authentication for server-side API access.

## Example

```bash
curl https://api.makra.dev/v1/responses \
  -H "Authorization: Bearer $MAKRA_API_KEY"
```

## Best practices

- Do not expose keys to browser clients.
- Rotate credentials regularly.
- Log request ids, not raw secrets.
