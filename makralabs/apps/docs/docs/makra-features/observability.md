# Observability

If you can’t see what happened, you can’t fix it.
Makra tracks the lifecycle of a request so you can answer:

- What context did we retrieve?
- Which tools were called?
- What did we show the model?
- Why did the answer change?

## Traces and spans

A trace groups related operations (retrieval, tool calls, model requests).
Spans provide timing and payload metadata.

## Debug workflow

1. Open a trace for a failed request
2. Inspect the retrieved bundle
3. Confirm grounding: does the answer cite the bundle?
4. Tighten intent or adjust ranking filters

