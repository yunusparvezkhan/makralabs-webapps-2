# The Memoization Model

Memoization is a technique where the result of an expensive computation is cached so that future calls with the same input return the cached result instead of re-running the computation. Makra applies this idea to web extraction: the expensive work of understanding a page's structure is done once, and the result is reused for every request that follows.

![Cold, hot, and warm extraction paths in Makra](/images/docs/makra-sdk/cold-hot-warm-paths.svg)

---

## Why web pages are memoizable

Web pages aren't generated individually — they're produced from templates. Every product page on an e-commerce site is rendered by the same server-side component. Every article on a news site follows the same layout. Every GitHub profile loads the same set of DOM elements in the same structural hierarchy.

The data changes from page to page. The structure doesn't.

This is the key insight. If you've learned that on a given e-commerce site, the element matching a certain CSS selector pattern always contains the product price — then that knowledge is valid not just for the page you learned it from, but for every product page on that site. The cost of learning that relationship is fixed. The number of pages you can apply it to is unbounded.

---

## What Makra stores

When Makra learns a page, it builds and stores a **PageSchema** — a mapping between the page's DOM elements and the semantic meaning of the data they contain. For each data field it finds, the schema records:

- A **semantic label** — a human-readable name for the field, like `products.price` or `article.author`
- A **description** — a natural language explanation of what the field represents, written during the annotation process
- A **parameterized CSS selector** — a pattern that identifies where in the DOM this field lives, generalized across all instances of repeated elements

The selector is stored as a template rather than a fixed path. For example, instead of three separate selectors for the prices of items 1, 2, and 3 in a product list, Makra stores a single pattern:

```
div.product:nth-of-type({n}) > span.price
```

Where `{n}` is a variable that can be instantiated to retrieve any item in the list. This means a schema learned from a page with 10 products applies just as well to a page with 50 — no re-learning required.

---

## What Makra does not store

Makra stores structural knowledge, not data. The actual values — prices, titles, article text, star ratings — are never cached. Every `extract` call fetches the live page and reads current values directly from the DOM.

This distinction matters: Makra's efficiency comes from knowing *where* data lives, not from remembering *what was there before*. The freshness of the data is never compromised by the caching of structure.

---

## Templates as cache keys

Makra identifies page templates by normalizing their URLs — replacing variable path segments and query parameters with placeholders:

```
example.com/products?page=1   →   example.com/products?page={}
example.com/articles/my-post  →   example.com/articles/{}
example.com/users/alice        →   example.com/users/{}
```

Any URL that normalizes to the same pattern shares a single schema. This is what makes the memoization valuable at scale. A batch extraction job that visits 500 pages of a paginated product catalog benefits from learning the structure on the very first page. The remaining 499 go straight to extraction — the structural knowledge is already in place.

---

## The efficiency compound

Memoization's benefits compound across a codebase, not just within a single job. Once Makra has learned the structure of a page on your account, that knowledge is available to every subsequent call — regardless of when it runs, what script it comes from, or what schema it requests.

If your agent visits a GitHub profile today and a pipeline visits the same site tomorrow, the pipeline benefits from what the agent already learned. The cost of learning is shared.
