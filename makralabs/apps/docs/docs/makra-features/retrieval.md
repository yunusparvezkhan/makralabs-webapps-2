# Retrieval pipelines

Retrieval is not just “top-k embeddings”. Makra pipelines let you:

1. Filter by recency, labels, or data source
2. Rank by relevance
3. Compress and deduplicate
4. Produce a bundle that fits a token budget

## Bundles

A bundle is designed to be fed into a model call:

- Short, high-signal snippets
- Structured facts
- Optional citations and provenance

## Practical guidance

### Start with intent
Always supply an `intent` that describes what the model is trying to do. The same session can produce different bundles depending on intent.

### Use budgets
Set a token budget so retrieval doesn’t balloon. If something doesn’t fit, it’s better to drop low-signal context than to truncate everything.

### Prefer structured facts for stable data
Names, plans, permissions, and preferences should be structured facts so your model doesn’t have to “re-discover” them every turn.

