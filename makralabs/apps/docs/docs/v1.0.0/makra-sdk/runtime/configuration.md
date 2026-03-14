# Configuration

In v1, explicit configuration matters because fewer runtime defaults are applied automatically.

## Priorities

- Set timeouts intentionally.
- Keep credentials separated by environment.
- Add retries only where transient failures are expected.

## Operational note

Keep Makra client setup in one place so environment changes remain easy to review.
