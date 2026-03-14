# Next.js Support Agent

This example shows how a support assistant can live inside a Next.js app while keeping Makra credentials and orchestration logic on the server.

## Architecture

- Client components capture user input and render results.
- A route handler or server action calls Makra.
- The response is normalized and streamed or returned as JSON.

## Example server action

```ts
export async function askSupport(question: string) {
  const response = await makra.responses.create({
    model: "gpt-5-mini",
    input: `Answer this support question with product-safe guidance:\n\n${question}`,
  });

  return { answer: response.output_text };
}
```

## Production guidance

- Add rate limiting at the app edge.
- Log request ids for failed responses.
- Redact any user-provided secrets from logs.
