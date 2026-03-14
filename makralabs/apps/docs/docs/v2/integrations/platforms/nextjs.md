# Next.js

Next.js is a strong default framework for Makra applications because it supports server-centric orchestration while still giving you flexible client experiences.

## Recommended pattern

- Use route handlers for API-like behavior.
- Use server actions for tightly coupled UI workflows.
- Keep client components focused on display and interaction.

## Data flow

1. The UI submits a request.
2. Server-side code validates input and calls Makra.
3. The result is normalized and returned to the page.
4. The UI renders the final answer or streamed partials.
