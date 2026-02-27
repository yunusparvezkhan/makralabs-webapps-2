export async function renderMarkdown(markdown: string): Promise<{ html: string }> {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  const slugCounts = new Map<string, number>();
  const slugify = (raw: string) => {
    const base = raw
      .trim()
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };

  const escapeHtml = (input: string) =>
    input
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const highlightPython = (code: string) => {
    const keywords = new Set([
      "False",
      "None",
      "True",
      "and",
      "as",
      "assert",
      "async",
      "await",
      "break",
      "class",
      "continue",
      "def",
      "del",
      "elif",
      "else",
      "except",
      "finally",
      "for",
      "from",
      "global",
      "if",
      "import",
      "in",
      "is",
      "lambda",
      "nonlocal",
      "not",
      "or",
      "pass",
      "raise",
      "return",
      "try",
      "while",
      "with",
      "yield",
    ]);

    const builtins = new Set([
      "print",
      "len",
      "range",
      "list",
      "dict",
      "set",
      "tuple",
      "str",
      "int",
      "float",
      "bool",
      "enumerate",
      "zip",
      "map",
      "filter",
      "sum",
      "min",
      "max",
      "any",
      "all",
      "sorted",
      "isinstance",
      "type",
      "open",
    ]);

    const isIdentStart = (ch: string) => /[A-Za-z_]/.test(ch);
    const isIdent = (ch: string) => /[A-Za-z0-9_]/.test(ch);
    const isDigit = (ch: string) => /[0-9]/.test(ch);

    const out: string[] = [];
    let i = 0;

    const push = (text: string) => out.push(escapeHtml(text));
    const pushSpan = (cls: string, text: string) => out.push(`<span class="${cls}">${escapeHtml(text)}</span>`);

    while (i < code.length) {
      const ch = code[i] ?? "";

      // Newlines
      if (ch === "\n") {
        out.push("\n");
        i += 1;
        continue;
      }

      // Comments
      if (ch === "#") {
        const start = i;
        while (i < code.length && code[i] !== "\n") i += 1;
        pushSpan("tok-com", code.slice(start, i));
        continue;
      }

      // Triple quotes
      const next3 = code.slice(i, i + 3);
      if (next3 === "'''" || next3 === '"""') {
        const quote = next3;
        const start = i;
        i += 3;
        while (i < code.length && code.slice(i, i + 3) !== quote) i += 1;
        i = Math.min(code.length, i + 3);
        pushSpan("tok-str", code.slice(start, i));
        continue;
      }

      // Single/double quoted strings
      if (ch === "'" || ch === '"') {
        const quote = ch;
        const start = i;
        i += 1;
        while (i < code.length) {
          const c = code[i] ?? "";
          if (c === "\\") {
            i += 2;
            continue;
          }
          if (c === quote) {
            i += 1;
            break;
          }
          i += 1;
        }
        pushSpan("tok-str", code.slice(start, i));
        continue;
      }

      // Numbers
      if (isDigit(ch)) {
        const start = i;
        i += 1;
        while (i < code.length && /[0-9a-fA-FxXoObB._]/.test(code[i] ?? "")) i += 1;
        pushSpan("tok-num", code.slice(start, i));
        continue;
      }

      // Identifiers
      if (isIdentStart(ch)) {
        const start = i;
        i += 1;
        while (i < code.length && isIdent(code[i] ?? "")) i += 1;
        const ident = code.slice(start, i);
        if (keywords.has(ident)) {
          pushSpan("tok-kw", ident);
        } else if (builtins.has(ident)) {
          pushSpan("tok-bui", ident);
        } else {
          push(ident);
        }
        continue;
      }

      // Punctuation / operators
      push(ch);
      i += 1;
    }

    return out.join("");
  };

  const renderInline = (input: string) => {
    // Escape first, then add markup.
    const escaped = escapeHtml(input);

    // Code spans: split on backticks to avoid formatting inside code.
    const parts = escaped.split("`");
    for (let i = 1; i < parts.length; i += 2) {
      parts[i] = `<code>${parts[i]}</code>`;
    }
    let out = parts.join("");

    // Links: [text](url)
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
      const safeText = String(text);
      const safeUrl = String(url).replace(/"/g, "%22");
      return `<a href="${safeUrl}">${safeText}</a>`;
    });

    // Bold/italic (simple)
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return out;
  };

  let html = "";
  let inCodeFence = false;
  let codeFenceBuffer: string[] = [];

  let inUl = false;
  let inOl = false;
  let paragraphBuffer: string[] = [];
  let skippedFirstH1 = false;

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    const text = paragraphBuffer.join(" ").replace(/\s+/g, " ").trim();
    if (text) html += `<p>${renderInline(text)}</p>\n`;
    paragraphBuffer = [];
  };

  const closeLists = () => {
    if (inUl) {
      html += `</ul>\n`;
      inUl = false;
    }
    if (inOl) {
      html += `</ol>\n`;
      inOl = false;
    }
  };

  const openUl = () => {
    if (inOl) {
      html += `</ol>\n`;
      inOl = false;
    }
    if (!inUl) {
      html += `<ul>\n`;
      inUl = true;
    }
  };

  const openOl = () => {
    if (inUl) {
      html += `</ul>\n`;
      inUl = false;
    }
    if (!inOl) {
      html += `<ol>\n`;
      inOl = true;
    }
  };

  for (const line of lines) {
    const trimmed = line.trimEnd();

    // Fenced code blocks
    if (trimmed.startsWith("```")) {
      if (!inCodeFence) {
        flushParagraph();
        closeLists();
        inCodeFence = true;
        codeFenceBuffer = [];
      } else {
        const raw = codeFenceBuffer.join("\n");
        const highlighted = highlightPython(raw);
        html += `<pre class="docs-code"><code class="language-python">${highlighted}\n</code></pre>\n`;
        inCodeFence = false;
        codeFenceBuffer = [];
      }
      continue;
    }

    if (inCodeFence) {
      codeFenceBuffer.push(line);
      continue;
    }

    // Blank line
    if (trimmed.trim().length === 0) {
      flushParagraph();
      closeLists();
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeLists();
      const level = headingMatch[1]!.length;
      const title = headingMatch[2]!.trim();
      const safeTitle = renderInline(title);
      if (level === 1 && !skippedFirstH1) {
        skippedFirstH1 = true;
        continue;
      }
      if (level === 2 || level === 3) {
        const id = slugify(title);
        html += `<h${level} id="${id}">${safeTitle}</h${level}>\n`;
      } else {
        html += `<h${level}>${safeTitle}</h${level}>\n`;
      }
      continue;
    }

    // Blockquote (single-line)
    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      closeLists();
      html += `<blockquote><p>${renderInline(quoteMatch[1] ?? "")}</p></blockquote>\n`;
      continue;
    }

    // Lists
    const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      flushParagraph();
      openUl();
      html += `<li>${renderInline(ulMatch[1] ?? "")}</li>\n`;
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      flushParagraph();
      openOl();
      html += `<li>${renderInline(olMatch[1] ?? "")}</li>\n`;
      continue;
    }

    // Paragraph
    paragraphBuffer.push(trimmed.trim());
  }

  flushParagraph();
  closeLists();
  if (inCodeFence) {
    const raw = codeFenceBuffer.join("\n");
    const highlighted = highlightPython(raw);
    html += `<pre class="docs-code"><code class="language-python">${highlighted}\n</code></pre>\n`;
  }

  return { html };
}
