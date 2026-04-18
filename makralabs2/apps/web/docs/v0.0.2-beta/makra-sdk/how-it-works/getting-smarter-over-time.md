# Getting Smarter Over Time

Makra's schemas are not static snapshots. They grow incrementally as pages evolve, accumulate coverage as more of a site is visited, and can be pre-warmed ahead of time when you know what you'll need. The longer Makra is used on a given site, the more complete and reliable its structural knowledge becomes.

![Incremental schema update flow showing new selectors merged into existing knowledge](/images/docs/makra-sdk/incremental-update.svg)

---

## Incremental schema updates

Websites change. A product page that had eight fields when Makra first learned it might have ten fields after a site redesign. A news article template might gain a "related topics" section that wasn't there before.

When Makra encounters a page whose structure has grown beyond what the stored schema covers, it doesn't throw away what it knows and start over. Instead, it identifies precisely which parts of the page are new — by comparing the current DOM's selectors against the stored schema — and runs annotation only on those novel elements. Everything previously learned is preserved and untouched.

The result of the partial annotation is merged into the existing schema. The update is additive: the schema gains coverage of the new elements while keeping all its existing field mappings intact. If the page gains a "customer reviews" section, Makra learns what's in that section without forgetting anything it already knew about titles, prices, and ratings.

The cost of an incremental update is proportional to what actually changed — not to the size of the full page. A small addition to a large page is cheap to learn.

---

## Coverage grows with use

The incremental model means schemas naturally improve over time and across different requests.

A page might render slightly different content depending on context: whether a product is in stock or not, whether a user is logged in, whether a promotional banner is active. Each variation exposes different DOM elements. As Makra encounters these variations across different visits, each one adds to the schema. Over time, the schema covers more and more of what the page can show — including states that no single visit would have captured.

This also means that teams benefit from shared learning. If your agent visits a site today and a batch pipeline visits the same site next week, the pipeline starts with everything the agent already learned.

---

## Pre-warming schemas

If you know in advance which pages your pipeline will need to extract from, you can separate schema learning from extraction entirely using `pre_process`. This runs the full annotation pipeline on a URL without performing any extraction — so when your first real `extract` call runs, the schema is already in place and it goes straight to the efficient path.

```python
await makra.pre_process(
    urls=["https://example.com/products"],
    options=Makra.PreprocessOptions(),
)
```

Pre-warming is useful in several situations:

- **Batch pipelines** where you want consistent, predictable behavior from the very first request and can't afford a slow first call
- **Agent systems** where the learning latency on a cold first request would disrupt a time-sensitive reasoning loop
- **Validation** — pre-warming lets you confirm that Makra can correctly learn a page before you commit it to a production pipeline

---

## Forcing a fresh start

Occasionally a page template changes so substantially that extending the existing schema would produce unreliable results — a full redesign, a platform migration, a total restructuring of the DOM. In these cases, you can bypass the stored schema entirely and force Makra to re-learn the page from scratch:

```python
result = await makra.extract(
    urls=["https://example.com/products"],
    schema=schema,
    options=Makra.ExtractOptions(disable_cache=True),
)
```

With `disable_cache=True`, Makra ignores any stored schema for this URL template and runs the full learning pipeline again. The new schema replaces the old one in storage. All future requests against this template will use the fresh schema.

This should be the exception, not the rule. For most page changes — additions, tweaks, new sections — the incremental update mechanism handles things correctly without any intervention. `disable_cache` is a tool for when you know a template has changed fundamentally and want to start clean.

---

## What Makra does not automatically handle

Schemas accumulate coverage, but they also accumulate stale entries over time. If a page element disappears entirely, its selector remains in the stored schema — because Makra has no way of knowing whether an element is permanently gone or simply absent on this particular render.

At extraction time, stale selectors are filtered out: Makra validates every matched selector against the live DOM before using it, so a selector that no longer resolves simply produces a `null` rather than a phantom value. But the stale entry remains in storage until the schema is explicitly refreshed with `disable_cache=True`.

For long-lived pipelines on fast-changing sites, it's worth periodically refreshing schemas to keep them clean.
