# Sessions

Sessions let Makra preserve conversational and workflow context across multiple requests.

## Why sessions matter

Without sessions, every request must restate important context. With sessions, you can build assistants that continue work across refreshes, handoffs, or long-running tasks.

## Recommended uses

- Multi-step copilots
- Review and approval workflows
- Tool-heavy assistants that need continuity

## Session lifecycle

1. Create a session when the workflow starts.
2. Append user or system messages as work progresses.
3. Store the session id in your app database.
4. Expire or archive stale sessions on your own schedule.

## Operational guidance

Treat session identifiers like application state: log them, persist them, and use them to correlate user-visible failures with backend activity.
