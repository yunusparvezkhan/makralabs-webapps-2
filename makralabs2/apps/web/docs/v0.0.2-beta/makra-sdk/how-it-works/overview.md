# How Makra Works

Makra is built around one idea: **you shouldn't have to pay to understand the same webpage twice.**

Most tools that extract web data using AI treat every request as a blank slate. Each page visit triggers the same expensive inference pipeline — regardless of whether the page has been seen before, regardless of whether a hundred identical pages were just processed. Makra takes a different approach.

On the first visit to any page, Makra learns how that page is structured and stores that knowledge. On every visit after — to the same page, or to any other page built from the same template — it skips the learning step entirely. The structural knowledge is already there. Only the data reading happens.

The result is a system that gets more efficient the more it's used. Early requests on an unfamiliar site are slower. But by the time a pipeline is running at scale — across hundreds or thousands of pages from the same domain — the per-request cost of extraction is close to that of a simple database lookup.

![Makra memoization overview showing cold learning and hot reuse paths](/images/docs/makra-sdk/memoization-overview.svg)

---

## The three states of a request

When you call `extract`, Makra checks whether it has seen this page's structure before. The answer determines what happens next.

**First visit — the learning path.** The page is new to Makra. It renders the page, analyzes its structure using a small number of LLM calls, and stores the result as a reusable schema. This is the expensive step. It happens once per page template.

**Revisit, structure unchanged — the efficient path.** The page has been seen before and its structure is fully covered by the stored schema. Makra retrieves the schema, matches your query fields against it semantically, and reads data from the DOM directly. No LLM is involved. This is the path that the vast majority of requests take once a site has been learned.

**Revisit, structure changed — the update path.** The page has evolved since it was last learned — new sections added, layout updated. Makra identifies exactly what's new, runs annotation only on the novel parts, and merges the result into the existing schema. Nothing previously learned is discarded. The cost is proportional to what changed, not to the page as a whole.

---

## In this section

- [The Memoization Model](./the-memoization-model.md) — What gets stored, what doesn't, and how page templates work as cache keys
- [Learning a Page](./learning-a-page.md) — What happens on the first visit: how Makra reads and understands a page's structure
- [Reusing What Was Learned](./reusing-what-was-learned.md) — How stored knowledge is matched to your query and used to extract data without LLM inference
- [Getting Smarter Over Time](./getting-smarter-over-time.md) — How schemas grow incrementally, and how to manage them for long-running pipelines
