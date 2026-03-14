# Python Worker

Use a worker process when Makra calls are part of ingestion, scoring, or offline evaluation pipelines.

## Example

```python
from makra import MakraClient

client = MakraClient(api_key=os.environ["MAKRA_API_KEY"])

def classify_ticket(ticket_text: str) -> str:
    response = client.responses.create(
        model="gpt-5-mini",
        input=f"Classify this support ticket by routing queue:\n\n{ticket_text}",
    )
    return response.output_text
```

## Worker guidance

- Keep jobs idempotent.
- Persist request ids with job metadata.
- Handle retries at the queue layer for transient failures.

## Good fit

This pattern works well for nightly enrichment, import pipelines, and backlog triage automation.
