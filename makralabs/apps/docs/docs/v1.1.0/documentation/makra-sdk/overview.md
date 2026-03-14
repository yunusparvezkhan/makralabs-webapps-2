# Makra SDK Overview

Makra SDK is the fastest way to move from raw model calls to a production-ready application with tools, memory, and retrieval already wired into a consistent runtime.

## What the SDK includes

- A typed client for agents, sessions, and responses.
- First-class support for tool calling and structured output.
- Shared configuration for environments, retries, and telemetry.
- Helpers for local development and production deployment.

## Recommended reading order

1. Start with Quickstart to get a working app running.
2. Review Configuration before shipping to staging.
3. Use API Reference pages when you need exact request and response behavior.

## Core concepts

### Agent runtime

The runtime coordinates prompts, tool execution, memory lookup, and final response generation. It is designed so application code stays close to business logic instead of SDK plumbing.

### Sessions

Sessions collect conversational state and tool outputs over time. This lets you build assistants that can continue work across refreshes, workflows, and handoffs.

### Environment-aware config

Makra separates local, staging, and production behavior through explicit configuration so secrets, logging, and rate controls remain predictable.

## Minimal setup

```ts
import { createMakraClient } from "@makra/sdk";

const makra = createMakraClient({
  apiKey: process.env.MAKRA_API_KEY!,
  environment: "development",
});
```

## Best practices

- Keep API keys server-side.
- Start with conservative timeouts and retry limits.
- Treat examples as a baseline and add your own observability early.

## Next steps

Continue to Quickstart for a working end-to-end example.
