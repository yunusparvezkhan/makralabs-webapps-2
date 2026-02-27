# Testing & evaluation

AI apps need more than unit tests. You want **behavioral regression tests**.

## What to test

- Retrieval stability (same intent → similar bundle)
- Tool permission enforcement
- Prompt changes (answer quality doesn’t regress)
- Cost controls (token budgets, tool call limits)

## Golden tests

Store:

- User message
- Retrieved bundle
- Expected citations
- Expected tool calls (or “no tools”)

Then run the same test set on every change.

