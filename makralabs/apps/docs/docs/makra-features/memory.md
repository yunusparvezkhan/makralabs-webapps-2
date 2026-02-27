# Memory & sessions

Makra makes memory an explicit part of your application architecture.
You decide what gets stored, what gets summarized, and what gets retrieved.

## Session design

Use a session for:

- A chat thread
- A support ticket
- A background job (e.g. “analyze these 50 PDFs”)

Makra sessions are intentionally simple: you can attach metadata, labels, and lifecycle state.

## Memory types

Common memory items:

- `message`: user/assistant turns
- `note`: developer-authored or tool-authored context (“User is on Pro plan”)
- `fact`: extracted structured fields (great for personalization)
- `tool_result`: normalized output from tools

## Retention policies

Instead of storing everything forever:

- Keep raw tool outputs short-lived
- Promote stable preferences into facts
- Store citations for anything user-facing

## Patterns

### Preferences
Write preferences as facts, not as scattered chat turns.

### Summaries
Use summaries to compress long sessions but keep “ground truth” snippets available for citations.

