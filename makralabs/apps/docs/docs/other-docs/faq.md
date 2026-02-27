# FAQ

## Do I need a vector database?

Not always. Many apps do well with a mix of:

- Recency filtering
- Structured facts
- Lightweight embeddings for long-lived documents

## Should I store the entire chat log?

Store what you need to explain and improve behavior:

- Key decisions
- User preferences
- Citations for user-facing claims

Then summarize and prune aggressively.

## Can I use Makra with any model provider?

Yes. Makra focuses on context and tooling; you can plug in your preferred model provider.

