# JavaScript Client

This v1 example shows a minimal service wrapper around Makra responses for existing Node.js applications.

## Example

```ts
export async function generateSummary(input: string) {
  const response = await makra.responses.create({
    model: "gpt-5-mini",
    input,
  });

  return response.output_text;
}
```

## Recommendation

If you are building a new app, use the v2 example set as your starting point.
