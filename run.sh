#!/usr/bin/env bash
#
# BEACHHEAD — one-command local runner (with thorough debug logging).
#
# Starts the Convex backend (deploy functions + watch) AND the Next.js dev
# server together, waits for each to come up, and tears both down on Ctrl+C.
#
# Usage:
#   ./run.sh             # from the repo root; it cds into horizon/ itself
#   DEBUG=1 ./run.sh     # verbose: shell trace (set -x) + extra diagnostics
#
# Logs: everything is mirrored to horizon/.run-logs/<run|convex|next>-<ts>.log
# (gitignored). Tail the backend live with:  tail -f horizon/.run-logs/convex-*.log
#
set -euo pipefail

# ---- resolve the app dir (horizon/) regardless of where we're invoked from --
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT/horizon"
APP_DIR="$(pwd)"

# ---- logging ----------------------------------------------------------------
LOG_DIR=".run-logs"
mkdir -p "$LOG_DIR"
TS="$(date +%Y%m%d-%H%M%S)"
RUN_LOG="$LOG_DIR/run-$TS.log"
CONVEX_LOG="$LOG_DIR/convex-$TS.log"
NEXT_LOG="$LOG_DIR/next-$TS.log"

log()  { printf '%s [run]  %s\n'        "$(date '+%H:%M:%S')" "$*" | tee -a "$RUN_LOG"; }
warn() { printf '%s [run][WARN]  %s\n'  "$(date '+%H:%M:%S')" "$*" | tee -a "$RUN_LOG" >&2; }
die()  { printf '%s [run][ERROR] %s\n'  "$(date '+%H:%M:%S')" "$*" | tee -a "$RUN_LOG" >&2; exit 1; }

if [ "${DEBUG:-0}" = "1" ]; then
  log "DEBUG=1 -> enabling shell trace (set -x)"
  export PS4='+ $(date "+%H:%M:%S") ${BASH_SOURCE##*/}:${LINENO}: '
  set -x
fi

log "================ BEACHHEAD runner ================"
log "logs dir: $APP_DIR/$LOG_DIR"

# ---- environment diagnostics ------------------------------------------------
log "--- environment ---"
log "cwd:           $APP_DIR"
command -v node >/dev/null 2>&1 || die "node not found (need Node 20+)."
command -v npm  >/dev/null 2>&1 || die "npm not found."
log "node:          $(node --version)"
log "npm:           $(npm --version)"
log "convex CLI:    $(npx --no-install convex --version 2>/dev/null || echo '(will resolve on first use)')"
log "git:           $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?') @ $(git rev-parse --short HEAD 2>/dev/null || echo '?')"

# ---- preflight: env file ----------------------------------------------------
if [ ! -f .env.local ]; then
  die ".env.local not found in $APP_DIR.
       It binds the app to your Convex deployment. Generate it once with:
           npx convex dev      (sign in, then pick/create your project)
       That writes CONVEX_DEPLOYMENT + NEXT_PUBLIC_CONVEX_URL into .env.local.
       Then re-run ./run.sh."
fi

DEPLOY="$(grep -E '^CONVEX_DEPLOYMENT=' .env.local | head -1 | cut -d= -f2- | awk '{print $1}' || true)"
CONVEX_URL="$(grep -E '^NEXT_PUBLIC_CONVEX_URL=' .env.local | head -1 | cut -d= -f2- | tr -d ' ' || true)"
SITE_URL="$(grep -E '^NEXT_PUBLIC_CONVEX_SITE_URL=' .env.local | head -1 | cut -d= -f2- | tr -d ' ' || true)"
log "--- convex binding (.env.local) ---"
log "deployment:    ${DEPLOY:-<unset>}"
log "client url:    ${CONVEX_URL:-<unset>}"
log "site url:      ${SITE_URL:-<unset>}"
[ -n "$CONVEX_URL" ] || warn "NEXT_PUBLIC_CONVEX_URL is empty — the UI will not connect to Convex."
if [ -f .env ]; then log ".env:          present"; else log ".env:          absent (fine — provider keys live on the Convex deployment, not here)"; fi

# ---- dependencies -----------------------------------------------------------
log "--- dependencies ---"
if [ ! -d node_modules ]; then
  log "node_modules missing -> running 'npm ci' (logged to $RUN_LOG)"
  npm ci 2>&1 | tee -a "$RUN_LOG"
else
  log "node_modules present (skipping install; run 'npm ci' manually to refresh)"
fi

# ---- port check -------------------------------------------------------------
if command -v lsof >/dev/null 2>&1; then
  if lsof -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
    warn "port 3000 is already in use — Next.js may fail to bind (is the app already running elsewhere?)"
  fi
fi

# ---- lifecycle: clean shutdown ---------------------------------------------
CONVEX_PID=""
ANNOUNCER_PID=""
cleanup() {
  local code=$?
  printf '\n'
  log "--- shutting down (exit code %s) ---" "$code"
  if [ -n "$ANNOUNCER_PID" ]; then kill "$ANNOUNCER_PID" 2>/dev/null || true; fi
  if [ -n "$CONVEX_PID" ] && kill -0 "$CONVEX_PID" 2>/dev/null; then
    kill "$CONVEX_PID" 2>/dev/null || true
    log "stopped Convex (pid $CONVEX_PID)"
  fi
  log "logs saved under $APP_DIR/$LOG_DIR"
}
trap cleanup EXIT INT TERM

# ---- start Convex backend (background; full output to its log file) ---------
log "--- starting Convex backend (deploy + watch) ---"
log "convex output -> $CONVEX_LOG   (tail -f to follow)"
npx convex dev >"$CONVEX_LOG" 2>&1 &
CONVEX_PID=$!
log "convex pid: $CONVEX_PID"

log "waiting for Convex to deploy functions (up to 90s)..."
convex_ready=0
for i in $(seq 1 90); do
  if grep -q "Convex functions ready" "$CONVEX_LOG" 2>/dev/null; then
    convex_ready=1; log "Convex is READY (~${i}s). Functions deployed + watching."; break
  fi
  if ! kill -0 "$CONVEX_PID" 2>/dev/null; then
    warn "convex dev exited early — see $CONVEX_LOG:"; tail -n 20 "$CONVEX_LOG" 2>/dev/null | sed 's/^/    convex| /' || true; break
  fi
  sleep 1
done
if [ "$convex_ready" != "1" ] && kill -0 "$CONVEX_PID" 2>/dev/null; then
  warn "Convex not reported ready after 90s — continuing; check $CONVEX_LOG"
fi

# ---- announcer: print the ready banner once Next is up (background) ---------
print_banner() {
  {
    printf '\n'
    echo "  ============================================================"
    echo "  ✅ BEACHHEAD is running"
    echo "     UI:        http://localhost:3000"
    echo "     Convex:    ${CONVEX_URL:-?}"
    echo "     Logs:      $APP_DIR/$LOG_DIR"
    echo "  ============================================================"
  } | tee -a "$RUN_LOG"
  cat <<'TIP' | tee -a "$RUN_LOG"
     Fire a test detection (new terminal, from horizon/):
       SITE=$(grep NEXT_PUBLIC_CONVEX_SITE_URL .env.local | cut -d= -f2)
       curl -XPOST "$SITE/signal" -H 'Content-Type: application/json' \
         -d '{"source":"manual","kind":"manual","companyDomain":"mercury.com"}'
     Ctrl+C stops both. Without OPENAI/ORANGESLICE/FIBER keys on the deployment
     the data legs run in labeled fixture mode (synthetic, never shown as live).
TIP
}
(
  for i in $(seq 1 120); do
    if curl -fsS -o /dev/null "http://localhost:3000" 2>/dev/null; then
      log "Next.js is UP at http://localhost:3000 (~${i}s after start)"
      print_banner
      exit 0
    fi
    sleep 1
  done
  warn "Next.js did not respond on :3000 within 120s — check $NEXT_LOG"
) &
ANNOUNCER_PID=$!

# ---- start Next.js (foreground; mirrored to console + log) ------------------
log "--- starting Next.js dev server (http://localhost:3000) ---"
log "next output -> $NEXT_LOG (and console below)"
npm run dev 2>&1 | tee -a "$NEXT_LOG"
