import assert from "node:assert/strict";
import test from "node:test";

import { parseAndRenderLatex } from "../src/lib/latex/renderLatex.ts";

test("renders common LaTeX document structure when content includes sections and math", () => {
  // Given: a small LaTeX document with a title, section, and display math.
  const content = String.raw`\title{Physics Notes}
\author{TextViz}
\maketitle

\section{Energy}
Mass-energy relation:
$$ E = mc^2 $$`;

  // When: the renderer converts it to preview HTML.
  const result = parseAndRenderLatex(content);

  // Then: document structure and math output are preserved in the HTML preview.
  assert.equal(result.errors.length, 0);
  assert.match(result.html, /latex-title/);
  assert.match(result.html, /Physics Notes/);
  assert.match(result.html, /latex-section/);
  assert.match(result.html, /katex/);
});

test("escapes plain text html when content contains script-like input", () => {
  // Given: user-controlled text that looks like active HTML.
  const content = String.raw`\section{Unsafe}
<script>alert("x")</script>
Plain <b>text</b>`;

  // When: the renderer converts it to preview HTML.
  const result = parseAndRenderLatex(content);

  // Then: user text is displayed as text, not executable markup.
  assert.doesNotMatch(result.html, /<script>/i);
  assert.doesNotMatch(result.html, /<b>text<\/b>/i);
  assert.match(result.html, /&lt;script&gt;alert/);
  assert.match(result.html, /Plain &lt;b&gt;text&lt;\/b&gt;/);
});
