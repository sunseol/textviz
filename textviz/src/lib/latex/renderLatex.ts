import katex from "katex";

type MathToken = {
  readonly id: string;
  readonly html: string;
  readonly displayMode: boolean;
};

export type LatexRenderResult = {
  readonly html: string;
  readonly errors: readonly string[];
};

const TOKEN_PREFIX = "TEXTVIZ_LATEX_TOKEN";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderMathToken(
  latex: string,
  displayMode: boolean,
  tokens: MathToken[],
  errors: string[],
  original: string,
): string {
  try {
    const rendered = katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
      trust: false,
      strict: false,
    });
    const id = `${TOKEN_PREFIX}_${tokens.length}`;
    const html = displayMode
      ? `<div class="katex-display-wrapper">${rendered}</div>`
      : rendered;
    tokens.push({ id, html, displayMode });
    return id;
  } catch (error) {
    errors.push(`${displayMode ? "Display" : "Inline"} math error: ${String(error)}`);
    return displayMode
      ? `<div class="latex-error">${escapeHtml(original)}</div>`
      : `<span class="latex-error">${escapeHtml(original)}</span>`;
  }
}

function stripNonRenderingCommands(content: string): string {
  return content
    .replace(/(?<!\\)%.*$/gm, "")
    .replace(/\\documentclass(\[[^\]]*\])?\{[^}]*\}/g, "")
    .replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, "")
    .replace(/\\geometry\{[^}]*\}/g, "")
    .replace(/\\hypersetup\{[\s\S]*?\}/g, "")
    .replace(/\\pagestyle\{[^}]*\}/g, "")
    .replace(/\\setlength\{[^}]*\}\{[^}]*\}/g, "")
    .replace(/\\renewcommand\{[^}]*\}\{[^}]*\}/g, "")
    .replace(/\\newcommand\{[^}]*\}(\[[^\]]*\])?\{[^}]*\}/g, "")
    .replace(/\\bibliographystyle\{[^}]*\}/g, "")
    .replace(/\\bibliography\{[^}]*\}/g, "")
    .replace(/\\tableofcontents/g, "")
    .replace(/\\listoffigures/g, "")
    .replace(/\\listoftables/g, "")
    .replace(/\\label\{[^}]*\}/g, "")
    .replace(/\\ref\{[^}]*\}/g, "[ref]")
    .replace(/\\cite\{[^}]*\}/g, "[cite]")
    .replace(/\\input\{[^}]*\}/g, "")
    .replace(/\\include\{[^}]*\}/g, "");
}

function tokenizeMath(content: string, errors: string[]): { readonly text: string; readonly tokens: readonly MathToken[] } {
  const tokens: MathToken[] = [];
  let text = content
    .replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (match: string, equation: string) =>
      renderMathToken(equation, true, tokens, errors, match),
    )
    .replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (match: string, equation: string) =>
      renderMathToken(`\\begin{aligned}${equation}\\end{aligned}`, true, tokens, errors, match),
    )
    .replace(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g, (match: string, dollarBody?: string, bracketBody?: string) =>
      renderMathToken(dollarBody ?? bracketBody ?? "", true, tokens, errors, match),
    );

  text = text.replace(/\$([^$\n]+?)\$|\\\(([^)]+?)\\\)/g, (match: string, dollarBody?: string, parenBody?: string) =>
    renderMathToken(dollarBody ?? parenBody ?? "", false, tokens, errors, match),
  );

  return { text, tokens };
}

function replaceTextCommands(content: string): string {
  let result = content;
  for (let index = 0; index < 3; index += 1) {
    result = result
      .replace(/\\textbf\{([^{}]*)\}/g, "<strong>$1</strong>")
      .replace(/\\textit\{([^{}]*)\}/g, "<em>$1</em>")
      .replace(/\\underline\{([^{}]*)\}/g, "<u>$1</u>")
      .replace(/\\emph\{([^{}]*)\}/g, "<em>$1</em>")
      .replace(/\\texttt\{([^{}]*)\}/g, "<code>$1</code>")
      .replace(/\\textrm\{([^{}]*)\}/g, "$1")
      .replace(/\\textsf\{([^{}]*)\}/g, "$1")
      .replace(/\\textsc\{([^{}]*)\}/g, '<span style="font-variant: small-caps">$1</span>');
  }
  return result;
}

function replaceDocumentCommands(content: string): string {
  return content
    .replace(/\\title\{([^}]*)\}/g, '<h1 class="latex-title">$1</h1>')
    .replace(/\\author\{([^}]*)\}/g, '<p class="latex-author">$1</p>')
    .replace(/\\date\{([^}]*)\}/g, '<p class="latex-date">$1</p>')
    .replace(/\\maketitle/g, "")
    .replace(/\\begin\{document\}/g, "")
    .replace(/\\end\{document\}/g, "")
    .replace(/\\section\*?\{([^}]*)\}/g, '<h2 class="latex-section">$1</h2>')
    .replace(/\\subsection\*?\{([^}]*)\}/g, '<h3 class="latex-subsection">$1</h3>')
    .replace(/\\subsubsection\*?\{([^}]*)\}/g, '<h4 class="latex-subsubsection">$1</h4>')
    .replace(/\\paragraph\{([^}]*)\}/g, '<p class="latex-paragraph"><strong>$1</strong> ')
    .replace(/\\begin\{itemize\}/g, '<ul class="latex-list">')
    .replace(/\\end\{itemize\}/g, "</ul>")
    .replace(/\\begin\{enumerate\}/g, '<ol class="latex-list">')
    .replace(/\\end\{enumerate\}/g, "</ol>")
    .replace(/\\item\s*/g, "<li>")
    .replace(/\\begin\{center\}/g, '<div class="text-center">')
    .replace(/\\end\{center\}/g, "</div>")
    .replace(/\\begin\{quote\}/g, '<blockquote class="latex-quote">')
    .replace(/\\end\{quote\}/g, "</blockquote>")
    .replace(/\\begin\{abstract\}/g, '<div class="latex-abstract"><h4>Abstract</h4>')
    .replace(/\\end\{abstract\}/g, "</div>")
    .replace(/\\&/g, "&amp;")
    .replace(/\\%/g, "%")
    .replace(/\\\$/g, "$")
    .replace(/\\#/g, "#")
    .replace(/\\_/g, "_")
    .replace(/\\{/g, "{")
    .replace(/\\}/g, "}")
    .replace(/\\ldots/g, "&hellip;")
    .replace(/\\cdots/g, "&ctdot;")
    .replace(/---/g, "&mdash;")
    .replace(/--/g, "&ndash;")
    .replace(/``/g, "&quot;")
    .replace(/''/g, "&quot;")
    .replace(/\\\\/g, "<br/>")
    .replace(/\\newline/g, "<br/>")
    .replace(/\\par\b/g, "</p><p>")
    .replace(/\\vspace\{[^}]*\}/g, '<div style="margin: 1em 0;"></div>')
    .replace(/\\hspace\{[^}]*\}/g, " ")
    .replace(/\\quad/g, "&emsp;")
    .replace(/\\qquad/g, "&emsp;&emsp;")
    .replace(/~/g, "&nbsp;")
    .replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, "");
}

function wrapParagraphs(content: string): string {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .map((paragraph) => {
      if (/^<(h[1-6]|div|ul|ol|blockquote|p)/i.test(paragraph)) {
        return paragraph;
      }
      return `<p>${paragraph}</p>`;
    })
    .join("\n");
}

function restoreMathTokens(content: string, tokens: readonly MathToken[]): string {
  return tokens.reduce((html, token) => html.replaceAll(token.id, token.html), content);
}

export function parseAndRenderLatex(content: string): LatexRenderResult {
  if (!content) {
    return { html: "", errors: [] };
  }

  const errors: string[] = [];
  const stripped = stripNonRenderingCommands(content);
  const { text, tokens } = tokenizeMath(stripped, errors);
  const escaped = escapeHtml(text);
  const withTextFormatting = replaceTextCommands(escaped);
  const withDocumentStructure = replaceDocumentCommands(withTextFormatting);
  const html = restoreMathTokens(wrapParagraphs(withDocumentStructure), tokens);

  return { html, errors };
}
