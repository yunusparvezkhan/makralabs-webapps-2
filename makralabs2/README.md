# MakraLabs Monorepo

Monorepo containing the unified Next.js web application and shared packages.

## Apps

- `@makralabs/web`: main app (`apps/web`, port `3000`)

## Packages

- `@makralabs/ui`: shared UI components
- `@makralabs/utils`: shared utilities
- `@makralabs/types`: shared TypeScript types
- `@makralabs/eslint-config`: shared ESLint config
- `@makralabs/tsconfig`: shared TypeScript configs
- `@makralabs/tailwind-config`: shared Tailwind config

## Quick Start

```bash
pnpm install
pnpm dev
```

## Commands

```bash
pnpm dev
pnpm dev:web
pnpm build
pnpm lint
pnpm type-check
```
