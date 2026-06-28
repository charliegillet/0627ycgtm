import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
} from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * proposeAction — create a pending action for a scored company. Idempotent:
 * if a non-failed action of the same type already exists for the company we
 * skip (so repeated scoring of the same account does not spam approvals).
 */
export const proposeAction = internalMutation({
  args: {
    companyId: v.id("companies"),
    leadId: v.optional(v.id("leads")),
    type: v.union(
      v.literal("slack"),
      v.literal("crm"),
      v.literal("email_draft")
    ),
    body: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("actions")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();
    const live = existing.find(
      (a) => a.type === args.type && a.status !== "failed"
    );
    if (live) {
      return { created: false, actionId: live._id };
    }

    const actionId = await ctx.db.insert("actions", {
      companyId: args.companyId,
      leadId: args.leadId,
      type: args.type,
      status: "pending",
      body: args.body,
      createdAt: Date.now(),
    });

    // Move the lead into the acting stage.
    if (args.leadId) {
      await ctx.db.patch(args.leadId, { stage: "acting" });
    }

    return { created: true, actionId };
  },
});

/**
 * approve — public mutation. Flips a pending action to approved and schedules
 * the (fixture-safe) Slack send.
 */
export const approve = mutation({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    const action = await ctx.db.get(args.actionId);
    if (!action) throw new Error("action not found");
    await ctx.db.patch(args.actionId, { status: "approved" });
    if (action.type === "slack") {
      await ctx.scheduler.runAfter(0, internal.act.sendSlack, {
        actionId: args.actionId,
      });
    }
    return { ok: true };
  },
});

/**
 * block — public mutation. Marks an action blocked and the lead dead.
 */
export const block = mutation({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    const action = await ctx.db.get(args.actionId);
    if (!action) throw new Error("action not found");
    await ctx.db.patch(args.actionId, { status: "blocked" });
    if (action.leadId) {
      await ctx.db.patch(action.leadId, { stage: "dead" });
    }
    return { ok: true };
  },
});

/**
 * sendSlack — internalAction. Real send only when SLACK_WEBHOOK_URL or
 * SLACK_BOT_TOKEN is configured; otherwise we mark the action "sent" with a
 * synthetic note so the demo flow completes without external creds.
 */
export const sendSlack = internalAction({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    const action = await ctx.runQuery(internal.act.getAction, {
      actionId: args.actionId,
    });
    if (!action) return { sent: false };

    const text = action.body ?? "New GTM lead ready to route.";
    const webhook = process.env.SLACK_WEBHOOK_URL;
    const botToken = process.env.SLACK_BOT_TOKEN;

    let note: string;
    let status: "sent" | "failed" = "sent";
    try {
      if (webhook) {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        note = res.ok
          ? "Sent via Slack webhook."
          : `Slack webhook failed (${res.status}).`;
        if (!res.ok) status = "failed";
      } else if (botToken) {
        const channel = process.env.SLACK_CHANNEL ?? "#gtm";
        const res = await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${botToken}`,
          },
          body: JSON.stringify({ channel, text }),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string };
        note = json.ok
          ? "Sent via Slack bot token."
          : `Slack API failed (${json.error ?? "unknown"}).`;
        if (!json.ok) status = "failed";
      } else {
        note = "__synthetic: true — no Slack creds; marked sent for demo.";
      }
    } catch (err) {
      status = "failed";
      note = `Slack send threw: ${String(err)}`;
    }

    await ctx.runMutation(internal.act.markActionStatus, {
      actionId: args.actionId,
      status,
      note,
    });

    return { sent: status === "sent", note };
  },
});

/**
 * getAction — internalQuery so sendSlack (an action) can read the row.
 */
export const getAction = internalQuery({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => ctx.db.get(args.actionId),
});

/**
 * markActionStatus — internalMutation finishing the send. On a successful send
 * the lead is moved to "done".
 */
export const markActionStatus = internalMutation({
  args: {
    actionId: v.id("actions"),
    status: v.union(v.literal("sent"), v.literal("failed")),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const action = await ctx.db.get(args.actionId);
    if (!action) return;
    await ctx.db.patch(args.actionId, {
      status: args.status,
      body: args.note ? `${action.body ?? ""}\n[${args.note}]` : action.body,
    });
    if (args.status === "sent" && action.leadId) {
      await ctx.db.patch(action.leadId, { stage: "done" });
    }
  },
});
