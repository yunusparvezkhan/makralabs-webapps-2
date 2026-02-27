# Makra SDK overview

Makra is a developer SDK for building AI applications that need **reliable context**.
Instead of pushing raw documents, HTML, and chat logs into the model, you store, shape, and retrieve only what’s useful—then attach it to model calls in a predictable way.

## What you build with Makra

Makra is designed for apps like:

- Customer support copilots that must remember policies and recent user actions
- Research assistants that cite sources and keep a clean audit trail
- Agent workflows that call tools and can be replayed deterministically
- “Bring your own data” chat experiences with strict privacy constraints

## How it fits in your stack

Makra sits between your app and your model provider:

1. You write messages, documents, and tool outputs to Makra.
2. Makra indexes + summarizes where appropriate.
3. Your app requests a **context bundle** for a session or task.
4. You send that bundle to your model (or to Makra’s tool runtime).

## Core concepts

### Workspaces
Isolation boundary for data. Use a separate workspace per environment (dev/staging/prod) and optionally per customer tenant.

### Sessions
Sessions represent “a thread of work” (a chat, a ticket, a job). Sessions are the unit you usually retrieve against.

### Memories
Memories are structured records (messages, notes, extracted facts, embeddings, tool results). You control what gets stored and how long it lives.

### Bundles
A bundle is the output of retrieval: **a minimal set** of snippets and structured facts, plus citations.

## Next steps

- Follow the **Quickstart** to create a chat that remembers user preferences.
- Read **Memory & sessions** to learn retention and grounding strategies.
- Use **Observability** to understand what your model was actually shown.

