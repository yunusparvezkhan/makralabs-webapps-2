# Debugging

Debugging AI apps is easier when you can reproduce the exact context and inputs.

## Inspect the retrieved bundle

When an answer is wrong:

1. Look at the bundle (snippets + facts)
2. Confirm it contains the needed source material
3. If not, adjust filters and ranking

## Confirm grounding

If the model answers without citations:

- Enable strict grounding for that endpoint
- Reject answers that can’t cite a bundle item

## Reduce variables

- Freeze tool outputs for replay
- Pin model versions for evaluation
- Keep prompts in source control

