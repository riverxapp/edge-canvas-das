function buildErrorScopeDocument() {
  return {
    intent_summary:
      "Fix the Next.js build error caused by an invalid Tailwind utility in the global stylesheet.",
    requested_outcome:
      "The app compiles without the CssSyntaxError from ./app/globals.css.",
    in_scope: [
      "Replace the unsupported font-inherit @apply usage with a valid Tailwind-compatible styling approach.",
      "Preserve the existing global typography, theme variables, and unrelated stylesheet behavior.",
    ],
    out_of_scope: [
      "Do not rewrite layout structure or route logic.",
      "Do not change unrelated components, scripts, or dependency versions.",
    ],
    constraints: [
      "One-file scope for the immediate build blocker.",
      "Keep unrelated logic intact.",
      "Use a deterministic, minimal fix.",
    ],
    assumptions: [
      "The project uses Tailwind CSS v3 utility generation through @apply.",
      "font-inherit is not defined as a custom utility in the current CSS pipeline.",
    ],
  };
}

module.exports = { buildErrorScopeDocument };
