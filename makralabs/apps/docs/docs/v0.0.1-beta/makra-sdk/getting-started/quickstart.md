# Quickstart

The v1 quickstart focuses on the shortest path to a working server-side integration.

## Install

```bash
pnpm add @makra/sdk
```

## First request

```ts
const response = await makra.responses.create({
  model: "gpt-5-mini",
  input: "Summarize the migration work for an older integration.",
});
```

## Recommendation

If you are building something new, compare this flow with the v2 quickstart before committing to legacy defaults.
