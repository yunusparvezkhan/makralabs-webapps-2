# Quickstart

This quickstart creates a minimal server-side Makra integration and sends a real request through the SDK.

## Prerequisites

- Node.js 20 or later
- A Makra API key stored in your environment
- A package manager such as `pnpm`

## Install

```bash
pnpm add @makra/sdk
```

## Initialize the client

```ts
import { createMakraClient } from "@makra/sdk";

export const makra = createMakraClient({
  apiKey: process.env.MAKRA_API_KEY!,
  environment: "development",
});
```

## Send your first request

```ts
const response = await makra.responses.create({
  model: "gpt-5-mini",
  input: "Summarize the rollout plan for a new webhook consumer.",
});

console.log(response.output_text);
```

## What success looks like

- The request completes without authentication errors.
- You receive a normalized text response.
- The request id is available for logs and support traces.

## Production checklist

- Keep keys server-side.
- Add redacted request logging.
- Set explicit timeout and retry values.
