# Extract API

The `extract` API retrieves structured data from one or more webpages and returns it as clean JSON, shaped exactly to match the schema you provide.

It is the primary API you'll use in production. Your agent or pipeline describes what data it needs; Makra finds it on the page and returns it in a structured, immediately usable form.

---

## Usage

```python
import os
import asyncio
from makra import Makra

makra = Makra(api_key=os.getenv("MAKRA_API_KEY"))

schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Repository List",
    "type": "object",
    "required": ["repositories"],
    "properties": {
        "repositories": {
            "type": "array",
            "description": "All repositories shown on the profile page.",
            "items": {
                "type": "object",
                "required": ["title", "link", "language", "stars", "forks"],
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "The name of the repository."
                    },
                    "link": {
                        "type": "string",
                        "format": "uri",
                        "description": "The full URL linking to the repository on GitHub."
                    },
                    "description": {
                        "type": "string",
                        "description": "A short summary of what the repository does."
                    },
                    "language": {
                        "type": "string",
                        "description": "The primary programming language used in the repository."
                    },
                    "stars": {
                        "type": "string",
                        "description": "The number of stars the repository has received, e.g. '1.2k'."
                    },
                    "forks": {
                        "type": "string",
                        "description": "The number of times the repository has been forked."
                    },
                },
            },
        }
    },
}

async def main():
    result = await makra.extract(
        urls=["https://github.com/ritsource"],
        schema=schema,
    )
    print(result)

asyncio.run(main())
```

---

## Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `urls` | `list[str]` | Yes | One or more URLs to extract data from. |
| `schema` | `dict` | Yes | A JSON Schema definition describing the shape and fields of the data you want. |
| `actions` | `list[Makra.ACTION]` | No | Optional behaviors that extend extraction beyond the starting URL. See [Actions](#actions). |
| `options` | `Makra.ExtractOptions` | No | Fine-grained control over extraction behavior. See [Options](#options). |

---

## The schema you provide

The schema you pass to `extract` is a standard [JSON Schema](https://json-schema.org/draft/2020-12) object. It describes two things: the **shape** of the data you want (which fields, nested how), and the **meaning** of each field (through description strings).

The shape tells Makra how to structure the response. The descriptions tell Makra how to find the right data on the page. Both matter.

### Writing effective descriptions

Makra uses semantic similarity to match your schema fields against the structural knowledge it has stored for the page. This means descriptions are not decorative — they directly affect which DOM element gets selected for each field.

A weak description is vague and could match many things. A strong description is specific about what the field represents and how it appears on the page.

```json
// Weak — could match many numeric fields
"stars": {
  "type": "string",
  "description": "A number"
}

// Strong — unambiguous
"stars": {
  "type": "string",
  "description": "The number of GitHub stars the repository has received, shown as a count like '1.2k' or '847'"
}
```

When a page has many fields of the same type — multiple prices, multiple counts, multiple links — strong descriptions are what allow Makra to tell them apart reliably.

---

## Return value

`extract` returns a JSON object whose shape mirrors your input schema exactly, populated with live data from the page.

```json
{
  "repositories": [
    {
      "title": "makra",
      "link": "https://github.com/ritsource/makra",
      "description": "A memory layer between the web and AI agents.",
      "language": "Python",
      "stars": "84",
      "forks": "12"
    },
    {
      "title": "neural-search",
      "link": "https://github.com/ritsource/neural-search",
      "description": "Semantic search engine built in Go.",
      "language": "Go",
      "stars": "31",
      "forks": "5"
    }
  ]
}
```

### When data is not found

If a field cannot be matched against the stored schema with sufficient confidence — or if the matched selector doesn't resolve in the current DOM — that field is returned as `null`:

```json
{
  "repositories": [
    {
      "title": "makra",
      "link": "https://github.com/ritsource/makra",
      "description": null,
      "language": "Python",
      "stars": "84",
      "forks": "12"
    }
  ]
}
```

`null` always means the data was not found. Makra never fabricates or approximates values for missing fields.

---

## Actions

Actions extend extraction beyond the starting URL. They are opt-in and tell Makra to traverse the site autonomously to find data that isn't fully present on the entry page.

```python
result = await makra.extract(
    urls=["https://example.com/products"],
    schema=schema,
    actions=[Makra.ACTION.NAVIGATION, Makra.ACTION.PAGINATION],
)
```

### `NAVIGATION`

With `NAVIGATION` enabled, Makra follows links found on the starting page to retrieve data that lives on linked pages rather than the entry point itself.

This is useful when a listing or index page links out to detail pages that contain the data you actually need. Rather than calling `extract` once per detail URL, you can point Makra at the index page, enable navigation, and let it follow the links autonomously.

**Example:** A job board lists job titles and companies on an index page, but full descriptions and requirements live on individual job pages. With `NAVIGATION`, a single call to the index page retrieves the full detail data from each linked listing.

### `PAGINATION`

With `PAGINATION` enabled, Makra traverses "next page" links automatically, collecting data across all pages before returning a single aggregated result.

This is useful for any site where the data you need is spread across multiple pages — search results, product catalogs, article feeds, leaderboards.

**Example:** A product search returns 24 items per page across 15 pages. With `PAGINATION`, a single `extract` call collects all items across all pages and returns them together.

You can use `NAVIGATION` and `PAGINATION` together. If an index page paginates across multiple pages, and each listing on each page links to a detail page, both actions working in combination will collect the full detail data from every listing across every page.

---

## Options

```python
result = await makra.extract(
    urls=["https://example.com/products"],
    schema=schema,
    options=Makra.ExtractOptions(
        disable_cache=True,
        tags_to_ignore=["img", "video"],
    ),
)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `disable_cache` | `bool` | `False` | When `True`, bypasses any stored schema for this URL template and re-learns the page from scratch. Use when a page has been substantially redesigned and the existing schema is no longer reliable. |
| `tags_to_ignore` | `list[str]` | `[]` | HTML tag names to exclude from extraction. Useful for skipping media elements (`img`, `video`, `audio`) that add structural noise without useful text content. |

---

## Full example: paginated product catalog

```python
schema = {
    "type": "object",
    "required": ["products"],
    "properties": {
        "products": {
            "type": "array",
            "description": "All products shown across the catalog pages.",
            "items": {
                "type": "object",
                "required": ["name", "price", "rating"],
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The full product name as displayed in the listing."
                    },
                    "price": {
                        "type": "string",
                        "description": "The listed price of the product, e.g. '$49.99'."
                    },
                    "rating": {
                        "type": "string",
                        "description": "The average customer star rating, e.g. '4.3 out of 5'."
                    },
                },
            },
        }
    },
}

result = await makra.extract(
    urls=["https://example.com/products?category=laptops"],
    schema=schema,
    actions=[Makra.ACTION.PAGINATION],
)
```
