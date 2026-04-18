# Introduction

Makra is a memory layer between the web and AI agents.

It gives your agents a way to read the web the same way a human researcher would — by understanding a page's structure, knowing what data lives where, and returning only what was asked for. Instead of dumping raw HTML into a context window and hoping an LLM can make sense of it, Makra returns clean, structured JSON that your agent can act on immediately.

---

## The problem Makra solves

When an AI agent needs data from the web, the most common approach is to fetch a page, pass its full content to a language model, and ask it to extract what's relevant. This works — but it's wasteful in a way that compounds quickly.

Every request is treated as if the page has never been seen before. The same product listing page, visited a hundred times across a batch job, runs a hundred full inference passes. The same GitHub profile, queried by different agents on different days, is understood from scratch each time.

Makra introduces a different model: **learn the structure of a page once, and reuse that knowledge indefinitely.** The cost of understanding a page is paid on the first visit and amortized across every request that follows. At scale, this brings the per-request cost of web extraction close to that of a simple embeddings lookup — not a full LLM inference pass.

---

## Who Makra is built for

Makra is built for **AI engineers** building agents and pipelines that need to interact with live web data.

It's the right tool if you are:

- Building an agent that queries websites as part of its reasoning loop and want to keep input token usage low
- Running batch extraction across many pages from the same site and want LLM costs that don't scale linearly with page count
- Writing an agentic scraper that should be intelligent — able to navigate and paginate autonomously — but run at a cost close to a traditional rule-based scraper

---

## How it works at a glance

Makra exposes two APIs. Together, they handle everything from page discovery to structured data extraction.

| API | What it does |
|---|---|
| `schema` | Analyzes a webpage and returns a JSON Schema describing its full structure — every data field the page contains, with semantic descriptions |
| `extract` | Extracts specific data from a webpage, given a JSON Schema describing what you want. Returns structured JSON matching your schema exactly |

On the first visit to any page, Makra learns its structure and stores it. On every visit after, extraction runs without any LLM inference — just semantic lookup and direct DOM reading. The more Makra is used on a site, the more efficient it becomes.

![Makra memoization overview showing cold learning and hot reuse paths](/images/docs/makra-sdk/memoization-overview.svg)

---

## Next steps

- [Quickstart](./quickstart.md) — install the SDK and run your first extraction in minutes
- [How Makra Works](./how-it-works/overview.md) — understand the memoization model that makes Makra efficient
- [API Reference](./api-reference/schema.md) — full reference for the `schema` and `extract` APIs
- [Using Makra with AI Agents](./guides/langchain-agent.md) — wrap Makra as a LangChain tool and build an agent that reads the web
