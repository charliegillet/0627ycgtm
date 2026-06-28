import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Re-detect seeded domains every 2 minutes. Dedupe in recordSignal keeps the
// same-day re-poll idempotent.
crons.interval("poll", { minutes: 2 }, internal.detect.poll, {});

export default crons;
