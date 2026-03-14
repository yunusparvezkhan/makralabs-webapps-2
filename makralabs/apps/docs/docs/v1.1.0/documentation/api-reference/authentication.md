# Authentication

Every Makra API request must be authenticated with a server-side API key.

## Base pattern

```http
Authorization: Bearer <MAKRA_API_KEY>
Content-Type: application/json
```

## Example request

```bash
curl https://api.makra.dev/v1/responses \
  -H "Authorization: Bearer $MAKRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-mini",
    "input": "List the required fields for webhook verification."
  }'
```

## Key handling best practices

- Use one key per environment.
- Rotate keys on a regular schedule.
- Scope keys to the least privilege needed.
- Never log raw credentials.

## Browser applications

Do not send privileged Makra keys from the client. Route browser traffic through your application server and enforce your own auth before calling Makra upstream.

## Troubleshooting

If requests fail with `401`, verify the key exists in the expected environment and that the `Authorization` header includes the `Bearer` prefix.
