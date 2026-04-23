/*
Scope document:
- intent_summary: Fix the Next.js build error caused by an invalid Tailwind utility in the global stylesheet.
- requested_outcome: The app should compile without the CssSyntaxError from `font-inherit` while preserving existing styling behavior.
- in_scope: Replace the invalid `@apply font-inherit;` usage with a valid CSS/Tailwind-compatible font inheritance rule in the global stylesheet.
- out_of_scope: Unrelated layout, routing, component, or dependency changes; changes to error-reporting logic.
- constraints: Preserve unrelated logic; keep changes file-scoped and deterministic.
- assumptions: The build error is caused solely by `font-inherit` not being a defined Tailwind utility in this project.
- affected_surfaces: `./app/globals.css`, app-wide typography inheritance.
- target_file_candidates: `app/globals.css` (direct source of error), `Node.js` (placeholder target in this run context).
- risk_notes: Tailwind `@apply` fails on unknown utilities; replacing with plain CSS should avoid the syntax error without changing semantics.
- success_checks: Next.js/Tailwind compilation proceeds past `./app/globals.css`; buttons/inputs/selects/textareas still inherit font from their parent.
*/

// Placeholder unified diff target for this run context.
// Actual fix belongs in ./app/globals.css.
export {};
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
