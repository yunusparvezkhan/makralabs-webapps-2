# Release Checklist

Use this checklist before shipping SDK, docs, or integration changes to production users.

## Product checks

- Confirm the new behavior matches the intended user flow.
- Verify migrations or feature flags are documented.
- Review error handling and fallback behavior.

## Documentation checks

- Update quickstarts and reference pages if contracts changed.
- Add screenshots or examples where useful.
- Ensure version-specific notes are clearly labeled.

## Operational checks

- Validate monitoring and alerts.
- Confirm rollback steps are documented.
- Check rate limits, retries, and timeouts in staging.
