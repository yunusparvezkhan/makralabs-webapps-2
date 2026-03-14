# Sessions

Sessions in v1 allow stateful workflows, but usually require more deliberate lifecycle management than newer integrations.

## Guidance

- Persist session ids with the owning record.
- Archive stale sessions on a schedule.
- Use logs and request ids to debug long-running flows.
