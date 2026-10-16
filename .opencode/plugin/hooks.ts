import type { Plugin } from "@opencode-ai/plugin";

// Post-edit validation hook for Halamanku.
// Every .ts/.tsx write triggers lint + typecheck so convention drift is
// caught immediately instead of at /validate time.
// Keep this file intentionally small — extend hooks here as workflows prove
// useful (e.g. permission interception, command rewriting).

export default (async ({ $ }) => {
  return {
    "tool.execute.after": async (input) => {
      // Only react to file edits.
      if (input?.tool !== "edit") return;

      const filePath = String(input.args?.filePath ?? "");
      if (!/\.(ts|tsx)$/.test(filePath)) return;

      try {
        await $`npm run lint`;
        await $`npm run typecheck`;
      } catch (error) {
        // A failing check shouldn't kill the session; log a hook-level error.
        console.error("[opencode.hooks] lint/typecheck failed:", error);
      }
    },
  };
}) satisfies Plugin;