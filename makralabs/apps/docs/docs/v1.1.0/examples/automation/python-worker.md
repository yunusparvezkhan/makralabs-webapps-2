# Python Worker

Python workers are useful for asynchronous ingestion, routing, and classification pipelines that already live outside your main application runtime.

## Example

```python
from makra import MakraClient

client = MakraClient(api_key=os.environ["MAKRA_API_KEY"])

def classify_ticket(ticket_text: str) -> str:
    response = client.responses.create(
        model="gpt-5-mini",
        input=f"Classify this support ticket by queue:\n\n{ticket_text}",
    )
    return response.output_text
```

## Worker checklist

- Make jobs idempotent.
- Store request ids with the job record.
- Retry at the queue layer for transient failures.
