import { action } from "../_generated/server";

/**
 * checkEnv — reports which provider integrations are live (real keys present)
 * vs. running in fixture mode.
 *
 * Convex constraint: process.env is reliably available inside the action
 * runtime. We expose this as a PUBLIC ACTION (not a query) so the client can
 * call it directly for a health badge. It is non-reactive — call it on mount /
 * on demand rather than subscribing. (A reactive variant would require an
 * internalAction writing a stored health row that a query reads; the direct
 * public action is simpler and sufficient for the demo.)
 */
export const checkEnv = action({
  args: {},
  handler: async () => {
    return {
      orangeSlice: Boolean(process.env.ORANGESLICE_API_KEY),
      fiber: Boolean(process.env.FIBER_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      slack: Boolean(
        process.env.SLACK_WEBHOOK_URL || process.env.SLACK_BOT_TOKEN
      ),
    };
  },
});
