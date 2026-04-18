# Quickstart

This guide walks you through installing Makra, setting up authentication, and running your first extraction. The whole thing takes about five minutes.

---

## Install the SDK

Makra is available on PyPI:

```bash
pip install makra
```

The SDK is fully asynchronous and requires Python 3.9 or higher.

---

## Get an API key

Makra is currently in **beta**. To get an API key, [contact us](#) to request access. Once you have one, store it as an environment variable:

```bash
export MAKRA_API_KEY="your-api-key"
```

---

## Your first extraction

The example below extracts a list of repositories from a GitHub profile page. It shows the two things every Makra program needs: a client instance and a JSON Schema describing the data you want.

```python
import os
import asyncio
from makra import Makra

makra = Makra(api_key=os.getenv("MAKRA_API_KEY"))

# Describe the shape of the data you want back.
# The description fields matter — Makra uses them to find the right
# data on the page, so the more specific, the better.
schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Repository List",
    "type": "object",
    "required": ["repositories"],
    "properties": {
        "repositories": {
            "type": "array",
            "description": "A list of repositories shown on the profile page.",
            "items": {
                "type": "object",
                "required": ["title", "link", "language", "stars"],
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "The name of the repository."
                    },
                    "link": {
                        "type": "string",
                        "description": "The full URL linking to the repository."
                    },
                    "language": {
                        "type": "string",
                        "description": "The primary programming language used in the repository."
                    },
                    "stars": {
                        "type": "string",
                        "description": "The number of stars the repository has received."
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

**What you get back:**

```json
{
  "repositories": [
    {
      "title": "makra",
      "link": "https://github.com/ritsource/makra",
      "language": "Python",
      "stars": "84"
    },
    {
      "title": "neural-search",
      "link": "https://github.com/ritsource/neural-search",
      "language": "Go",
      "stars": "31"
    }
  ]
}
```

Makra returns a JSON object that exactly mirrors the shape of your schema, populated with live data read directly from the page.

---

## What just happened

Behind the scenes, Makra did several things:

1. Loaded the GitHub profile page in a headless browser, fully rendering its JavaScript
2. Checked whether it had seen this page's structure before — it hadn't, so it ran its annotation pipeline to learn the page
3. Stored that structural knowledge for future use
4. Matched your schema fields against what it learned, found the right DOM elements, and read the current values
5. Returned the result as structured JSON

The next time you — or anyone else using Makra — calls `extract` on any GitHub profile page, steps 2 and 3 are skipped entirely. The structure is already known. Only the data reading happens.

---

## Using the Schema API

If you're not sure what data a page contains — for example, if your agent is visiting an unfamiliar URL — you can use the `schema` API to discover the page's structure first:

```python
async def main():
    page_schema = await makra.schema(
        urls=["https://github.com/ritsource"]
    )
    print(page_schema)

asyncio.run(main())
```

This returns a full JSON Schema definition describing every data field Makra found on the page, with descriptions. You can inspect it, pass it to an LLM to decide what's relevant, and then use the result as the input to `extract`. See the [Schema API reference](./api-reference/schema.md) for full details.

---

## Next steps

- Learn how Makra works under the hood → [How Makra Works](./how-it-works/overview.md)
- See all `extract` options → [Extract API Reference](./api-reference/extract.md)
- Build an agent that uses Makra as a tool → [Using Makra with AI Agents](./guides/langchain-agent.md)
