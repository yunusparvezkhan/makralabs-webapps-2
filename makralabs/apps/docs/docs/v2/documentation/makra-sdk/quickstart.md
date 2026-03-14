# Quickstart

This quickstart walks through a minimal Makra app that creates an agent, sends a prompt, and renders the response.

## Prerequisites

- Node.js 20 or later
- A Makra API key
- `pnpm`, `npm`, or `yarn`

## Install the package

```bash
pnpm add @makra/sdk
```

## Initialize the client

```ts
import { createMakraClient } from "@makra/sdk";

export const makra = createMakraClient({
  apiKey: process.env.MAKRA_API_KEY!,
});
```

## Send your first request

```ts
const response = await makra.responses.create({
  model: "gpt-5-mini",
  input: "Summarize the deployment risks for a new webhook consumer.",
});

console.log(response.output_text);
```

## What to expect

- Requests are authenticated with your server-side API key.
- The SDK normalizes common response fields for easier rendering.
- Errors include HTTP context and a stable error code for debugging.

## Production checklist

- Store the API key in a secret manager.
- Add request logging with redaction.
- Set explicit timeouts for upstream calls.

## Next steps

Review Configuration to tune retries, environments, and observability.
