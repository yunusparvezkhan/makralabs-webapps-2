# Authentication

All requests to Makra are authenticated with an API key. This page explains how to obtain one, how to configure it, and how to keep it secure.

---

## Getting an API key

Makra is currently in **beta**. API keys are not self-serve — [contact us](#) to request access. Once granted, your key is tied to your account and gives you access to all of Makra's APIs.

---

## Configuring the client

Pass your API key when creating the `Makra` client:

```python
from makra import Makra

makra = Makra(api_key="your-api-key")
```

In practice, you should never write your API key directly in code. Anyone with read access to your codebase — or to your version control history — would be able to see it. Instead, load it from an environment variable:

```python
import os
from makra import Makra

makra = Makra(api_key=os.getenv("MAKRA_API_KEY"))
```

And set the environment variable separately, outside your codebase:

```bash
export MAKRA_API_KEY="your-api-key"
```

---

## Managing secrets in different environments

How you store the environment variable depends on where your code runs:

**Local development** — store it in a `.env` file at the root of your project and load it with a library like `python-dotenv`. Make sure `.env` is in your `.gitignore` so it's never committed.

```bash
# .env
MAKRA_API_KEY=your-api-key
```

```python
from dotenv import load_dotenv
load_dotenv()
```

**Production / cloud environments** — use your platform's secrets manager. Most cloud providers have a native solution: AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, or environment variable injection in services like Railway, Render, or Fly.io. Avoid storing secrets in environment files on production servers.

**CI/CD pipelines** — inject the key as an encrypted secret through your CI provider (GitHub Actions secrets, GitLab CI variables, etc.). Never print or log the key value in pipeline output.

---

## If your key is compromised

If you suspect your API key has been exposed, [contact us](#) immediately to have it rotated. A compromised key should be treated as revoked — assume any requests made with it after exposure are unauthorized.
