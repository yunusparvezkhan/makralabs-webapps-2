# Makra SDK Overview

Makra SDK gives product teams a single runtime for model access, tool execution, retrieval, memory, and operational guardrails.

## What it is for

Use the SDK when you want application code to express product behavior instead of coordinating low-level provider calls and infrastructure concerns.

## Core capabilities

- Typed client methods for responses, agents, sessions, and workflows
- Centralized configuration for environments, retries, and timeouts
- Built-in support for tools and structured outputs
- Consistent request metadata for logging and observability

## Architecture at a glance

1. The app authenticates requests on the server.
2. Makra SDK prepares the prompt, tool definitions, and runtime options.
3. The runtime calls the model and executes any approved tool steps.
4. The response is normalized for rendering or storage.

## When to start here

Start with this page if you are evaluating Makra for a new product surface or trying to understand how the documentation is organized.

## Recommended next steps

- Read Quickstart for a working integration.
- Review Configuration before moving to staging.
- Use API Reference when you need exact field-level details.
