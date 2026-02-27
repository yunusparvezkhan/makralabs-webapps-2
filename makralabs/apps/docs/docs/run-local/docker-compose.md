# Docker compose

When you need full integration tests, you can run a local stack with Docker.

## What to run locally

Typical components:

- A local Postgres for session metadata
- An object store for blobs/tool outputs
- A vector index (optional)

## Compose tips

- Prefer named volumes so you can reset state intentionally
- Keep secrets in `.env` and never commit them

