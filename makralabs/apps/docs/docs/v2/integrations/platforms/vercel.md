# Vercel

The Vercel integration guide covers environment setup, deployment conventions, and runtime-safe Makra usage.

## Setup

- Add `MAKRA_API_KEY` to the Vercel project environment.
- Keep Makra calls in route handlers or server actions.
- Verify preview and production keys independently.

## Example route

```ts
export async function POST(req: Request) {
  const body = await req.json();
  const response = await makra.responses.create({
    model: "gpt-5-mini",
    input: body.prompt,
  });

  return Response.json({ text: response.output_text });
}
```

## Deployment guidance

Prefer narrow server-side wrappers so your UI layer stays easy to test and your secrets remain isolated.
