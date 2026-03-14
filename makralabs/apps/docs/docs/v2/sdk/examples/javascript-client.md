# JavaScript Client

This example shows a small server action that wraps the Makra SDK and returns a structured answer to the frontend.

## Why this pattern works

It keeps secrets on the server, makes instrumentation straightforward, and gives the UI a narrow contract to render.

## Example

```ts
import { createMakraClient } from "@makra/sdk";

const makra = createMakraClient({ apiKey: process.env.MAKRA_API_KEY! });

export async function summarizeReleaseNotes(text: string) {
  const response = await makra.responses.create({
    model: "gpt-5-mini",
    input: `Summarize these release notes for customer success:\n\n${text}`,
  });

  return { summary: response.output_text };
}
```

## Additions for production

- Validate input length before sending it upstream.
- Add request ids to logs and traces.
- Cache safe, repeatable prompts when appropriate.
