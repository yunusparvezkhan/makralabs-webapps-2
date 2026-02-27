# Tools & function calling

Makra helps you register tools with clear contracts and enforce runtime policies.

## Tool registration

Tools are defined by:

- Name + description (model-facing)
- Input schema
- Output schema
- Permissions (what data can the tool access)

## Streaming results

For long-running tools (web search, data extraction):

- Stream partial results to your UI
- Persist the final normalized output to Makra
- Retrieve it later as part of a bundle

## Policy examples

- Only allow “billing lookup” tool if the user is authenticated
- Strip secrets from tool output before saving
- Limit tool calls per request to control spend

