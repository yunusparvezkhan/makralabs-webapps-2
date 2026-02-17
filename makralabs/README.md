# MakraLabs Monorepo

Monorepo containing multiple Next.js applications and shared packages.

## Apps

- `@makralabs/web`: main app (`apps/web`, port `3000`)
- `@makralabs/docs`: docs app (`apps/docs`, port `3001`)

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
pnpm dev:docs
pnpm build
pnpm lint
pnpm type-check
```
