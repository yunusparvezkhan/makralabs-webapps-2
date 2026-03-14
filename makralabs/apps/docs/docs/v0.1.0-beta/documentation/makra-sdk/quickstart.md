# Quickstart

The v1 quickstart focuses on the minimal path to a working integration while preserving compatibility with older deployments.

## Install

```bash
pnpm add @makra/sdk
```

## First request

```ts
const response = await makra.responses.create({
  model: "gpt-5-mini",
  input: "Summarize the work required for a legacy migration.",
});
```

## Migration note

Review the v2 quickstart when you are ready to adopt newer defaults and cleaner configuration conventions.
