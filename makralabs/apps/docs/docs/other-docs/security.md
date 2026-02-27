# Security

This page outlines secure-by-default patterns when building AI applications.

## Key management

- Keep keys server-side
- Rotate tokens regularly
- Use separate workspaces per environment

## Data minimization

- Store only what you need
- Prefer structured facts over raw logs
- Enforce retention policies

## Auditability

- Record what context was retrieved
- Record what the model saw
- Require citations for high-stakes answers

