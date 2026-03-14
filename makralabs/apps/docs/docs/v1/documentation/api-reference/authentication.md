# Authentication

Makra API v1 uses bearer-token authentication with server-side credentials.

## Example

```bash
curl https://api.makra.dev/v1/responses \
  -H "Authorization: Bearer $MAKRA_API_KEY"
```

## Notes

- Do not expose keys in browser bundles.
- Rotate credentials regularly.
- Audit logs for unexpected usage patterns.
