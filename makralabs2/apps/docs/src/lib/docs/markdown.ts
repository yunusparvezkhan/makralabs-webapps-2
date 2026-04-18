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

  const sanitizeUrl = (input: string) => String(input).trim().replace(/"/g, "%22");

  const sanitizeClassName = (input: string) =>
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");

  const renderInlineText = (input: string) => {
    let out = escapeHtml(input);

    out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) => {
      return `<img src="${sanitizeUrl(String(url))}" alt="${escapeHtml(String(alt))}" loading="lazy" decoding="async" />`;
    });

    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
      return `<a href="${sanitizeUrl(String(url))}">${String(text)}</a>`;
    });

    out = out.replace(/~~([^~]+)~~/g, "<del>$1</del>");
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    out = out.replace(/_([^_]+)_/g, "<em>$1</em>");
    return out;
  };

  const renderInline = (input: string) => {
    const parts = input.split(/(`[^`]*`)/g);
    return parts
      .map((part) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
        }
        return renderInlineText(part);
      })
      .join("");
  };

  let html = "";
  let inCodeFence = false;
  let codeFenceBuffer: string[] = [];
  let codeFenceLanguage = "";

  let inUl = false;
  let inOl = false;
  let paragraphBuffer: string[] = [];
  let skippedFirstH1 = false;

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    const lines = paragraphBuffer.map((item) => item.trim()).filter(Boolean);
    if (lines.length > 0) html += `<p>${lines.map((line) => renderInline(line)).join("<br />\n")}</p>\n`;
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

  const renderImageFigure = (alt: string, src: string) => {
    const safeAlt = escapeHtml(alt);
    const safeSrc = sanitizeUrl(src);
    return `<figure class="docs-diagram"><img src="${safeSrc}" alt="${safeAlt}" loading="lazy" decoding="async" /></figure>\n`;
  };

  const renderCodeBlock = (code: string, language: string) => {
    const lang = sanitizeClassName(language || "text");
    const renderedCode = lang === "python" || lang === "py" ? highlightPython(code) : escapeHtml(code);
    return `<pre class="docs-code"><code class="language-${lang}">${renderedCode}\n</code></pre>\n`;
  };

  const splitTableRow = (row: string) => {
    const trimmedRow = row.trim().replace(/^\|/, "").replace(/\|$/, "");
    return trimmedRow.split("|").map((cell) => cell.trim());
  };

  const isTableDivider = (row: string) => {
    const cells = splitTableRow(row);
    return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
  };

  const getTableAlignment = (cell: string) => {
    const starts = cell.startsWith(":");
    const ends = cell.endsWith(":");
    if (starts && ends) return "center";
    if (ends) return "right";
    if (starts) return "left";
    return undefined;
  };

  const renderTable = (headerCells: string[], dividerCells: string[], bodyRows: string[][]) => {
    const alignments = dividerCells.map(getTableAlignment);
    const alignAttr = (index: number) => (alignments[index] ? ` style="text-align: ${alignments[index]}"` : "");
    const header = headerCells
      .map((cell, index) => `<th${alignAttr(index)}>${renderInline(cell)}</th>`)
      .join("");
    const body = bodyRows
      .map((row) => {
        const cells = headerCells.map((_, index) => row[index] ?? "");
        return `<tr>${cells.map((cell, index) => `<td${alignAttr(index)}>${renderInline(cell)}</td>`).join("")}</tr>`;
      })
      .join("\n");

    return `<div class="docs-table-wrap"><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div>\n`;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const trimmed = line.trimEnd();

    // Fenced code blocks
    const fenceMatch = trimmed.match(/^```\s*([A-Za-z0-9_-]+)?/);
    if (fenceMatch) {
      if (!inCodeFence) {
        flushParagraph();
        closeLists();
        inCodeFence = true;
        codeFenceLanguage = fenceMatch[1] ?? "";
        codeFenceBuffer = [];
      } else {
        const raw = codeFenceBuffer.join("\n");
        html += renderCodeBlock(raw, codeFenceLanguage);
        inCodeFence = false;
        codeFenceLanguage = "";
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

    // HTML comments
    if (/^<!--[\s\S]*-->$/.test(trimmed.trim())) {
      flushParagraph();
      closeLists();
      html += `${trimmed.trim()}\n`;
      continue;
    }

    // Horizontal rules
    if (/^ {0,3}([-*_])(?:\s*\1){2,}\s*$/.test(trimmed)) {
      flushParagraph();
      closeLists();
      html += `<hr />\n`;
      continue;
    }

    // Standalone images
    const imageMatch = trimmed.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushParagraph();
      closeLists();
      html += renderImageFigure(imageMatch[1] ?? "", imageMatch[2] ?? "");
      continue;
    }

    // Pipe tables
    const nextLine = lines[index + 1]?.trimEnd() ?? "";
    if (trimmed.includes("|") && isTableDivider(nextLine)) {
      const headerCells = splitTableRow(trimmed);
      const dividerCells = splitTableRow(nextLine);
      if (headerCells.length === dividerCells.length && headerCells.length > 0) {
        const bodyRows: string[][] = [];
        index += 2;
        while (index < lines.length) {
          const row = lines[index]?.trimEnd() ?? "";
          if (!row.trim() || !row.includes("|")) break;
          bodyRows.push(splitTableRow(row));
          index += 1;
        }
        index -= 1;
        flushParagraph();
        closeLists();
        html += renderTable(headerCells, dividerCells, bodyRows);
        continue;
      }
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
    html += renderCodeBlock(raw, codeFenceLanguage);
  }

  return { html };
}
