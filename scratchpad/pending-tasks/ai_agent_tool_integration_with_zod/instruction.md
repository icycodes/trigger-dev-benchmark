Trigger.dev tasks can act as robust, long-running tools for LLMs in the Vercel AI SDK ecosystem, providing built-in state management and observability.

You need to create a typed task named `search-database` that requires a strictly validated payload, and then export it wrapped as a native AI tool for direct integration into an LLM's `tools` array.

**Constraints:**
- Must use `schemaTask` from `@trigger.dev/sdk`.
- The task payload MUST be strictly validated using a Zod (`z.object`) schema requiring a `query` string parameter.
- The task must be exported using the `ai.tool()` wrapper method.