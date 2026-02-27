# Rate limits

Rate limits protect platform stability and keep costs predictable.

## Practical strategies

- Use exponential backoff with jitter
- Batch writes when possible
- Cache bundles for repeated reads during a short window

## Budgeted agents

For agent loops:

- Cap tool calls per request
- Cap max tokens for retrieval bundles
- Stop early when confidence is high

