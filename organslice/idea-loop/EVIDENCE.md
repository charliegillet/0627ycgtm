# EVIDENCE.md — Stage 1 Landscape Scan

> 28 external sources. 10 problem-evidence sources (≥4 describe user pain). 14 products. Verifier: PASS.
> Note: researcher identified the live event as the **Moss Conversational AI Hackathon (June 6–7, 2026)**. Conversational/voice AI (Moss + LiveKit + Nova Sonic + MiniMax) is a likely sponsor-favored axis.

## SPONSOR CAPABILITIES (what each can concretely do at a hackathon)

| Sponsor | Concrete capability | Unpopular feature judges reward | Risk / claim flag |
|---|---|---|---|
| **Moss** (YC F25) | Real-time semantic vector search runtime; hybrid BM25+embedding (tunable alpha); in-memory `loadIndex()` sub-10ms; BYOE; context-injection-into-system-message (skips a tool-call round-trip); auto-refresh polling | Context-injection pattern; tunable alpha hybrid | "sub-10ms" hardware-dependent, needs `loadIndex()`; verify pkg name `@moss-dev/moss` vs `inferedge_moss` |
| **LiveKit Agents** v1.5 | WebRTC voice agents; semantic+acoustic turn detection (Qwen2.5-0.5B), 14 langs; v1 cloud / v1-mini local; native MCP tools; **frontend tool-forwarding**; SIP telephony GA | Frontend tool-forwarding; per-language threshold calibration | — |
| **Nova 2 Sonic** (`amazon.nova-sonic-v1:0`) | Speech-to-speech via Bedrock bidi streaming; **async tool calling (keeps talking while tool runs)**; 1M ctx; 18 voices | Async tool calling during conversation | Benchmark figures are AWS vendor claims |
| **MiniMax** Speech-02/2.5 | TTS + voice clone (10s min); **voice-design-from-text-prompt** (describe→3 previews); 40+ langs; cross-lingual clone; MCP-JS | Voice-design-from-text endpoint | — |
| **Unsiloed AI** (YC) | Multimodal doc parsing; **word-level bounding boxes + confidence per field**; Parse/Extract/Split/Classify; Claude tool-use schemas | Multi-doc boundary Split; confidence scores | — |
| **TrueFoundry** | **Virtual MCP Server** — aggregate many MCP servers into one endpoint, zero new deploys; selective tool exposure; PII redaction; custom auth | Zero-deployment MCP aggregation | Only list/call ops; no resources yet |
| **Vercel AI Gateway** | Multi-provider LLM gateway <20ms; failover; OIDC; streaming/tools/structured/embeddings | OIDC passwordless on Vercel | — |
| **Exa / Perplexity** | Neural web search for agents; buying-signal detection (funding, launches); MCP servers | Buying-signal enrichment | — |

## A. PROBLEM EVIDENCE (10 sources)

1. **AI cold-outreach deliverability collapse** — AI-SDR campaigns cause −38pt sender-reputation drop in 90 days; reply rates decay 60%+ in 18mo; intent data 31–47% false-positive. Users: B2B SDR/RevOps. Workaround: domain rotation, manual pruning, revert to hybrid. Consequence: wasted capacity, $24M FTC/AG settlements. **high**
2. **CRM data quality makes AI amplify errors** — 76% orgs say <half their CRM data is accurate; 91% records incomplete; 30% goes stale/yr; ~16 deals lost/quarter. Users: Sales/RevOps. Workaround: manual cleaning while cutting QA headcount. **high**
3. **AI sales tools don't close the human→CRM loop** — Gong doesn't auto-update CRM/create tasks/trigger workflows; Smart Trackers need 50–100 examples + 40+hrs/mo; stack TCO $400–500/user/mo. Users: RevOps/sales mgrs. Workaround: manual CRM entry. **high**
4. **AI content trust collapse** — 31% trust brands LESS for visible AI content; 43% less likely to buy; 39% abandoned a purchase after bad AI experience; 91% expect AI disclosure. Users: marketing teams + consumers. Workaround: "AI-assisted" labels, human review. **high**
5. **Attribution broken; vanity metrics dominate** — 74% claim pipeline/revenue as primary metric but only 18% have revenue-marketing maturity; 84-day median cycle; single-touch misses 6–10 touchpoints. Users: CMO/demand-gen/RevOps. Workaround: spreadsheet reconciliation, last-touch proxy. **high**
6. **Dark funnel: 70–80% of journey invisible** — happens before contact-form; 94% of B2B buyers use LLMs; 93% of AI sessions end without a click; intent data 31–47% false positive. Users: vendors/SDR/demand-gen. **medium**
7. **SaaS onboarding abandonment** — avg activation 37.5%; >98% who never hit value churn in 2wks; TTFV >30min → 3x abandonment; each 10-min cut → 8–12% activation lift. Users: PLG product/growth. Workaround: static checklists, manual CSM. **medium**
8. **SaaS pricing/dunning/expansion breaking under agents** — per-seat breaks as agents replace seats; 30%+ have outcome-based components; Stripe bought Metronome ~$1B. Users: CFO/RevOps/AI founders. Workaround: spreadsheet billing, Orb/Lago metering. **high**
9. **Google penalizing AI content farms; GEO/AEO unmapped** — AI farms −50–90% traffic; March 2026 spam update targets scaled AI; 58.5% zero-click; no standard for AI-search citation optimization. Users: content/SEO. **high**
10. **AI ROI gap** — 30% of GenAI projects abandoned in 2026 for unclear value; CFOs demand revenue proof in 3–6mo; only 6% of orgs extract bottom-line value. Users: execs/vendors/growth. **high**

## B. SOLUTION LANDSCAPE (14 products — abbreviated; full records in researcher report)

| # | Product | Track | What remains manual / gap |
|---|---|---|---|
| 1 | Artisan (Ava) AI SDR | Sales Cyborgs | Hallucinations; LinkedIn-banned; deliverability 0/21 |
| 2 | Apollo.io | Sales Cyborgs | Personalization quality; no deliverability/intent copilot |
| 3 | Gong | Sales Cyborgs / Rev Autopilot | **Does NOT auto-update CRM**; tracker maintenance 40hr/mo |
| 4 | Clay | Sales Cyborgs / Reading Minds | Needs predefined account list (misses unknown TAM); $800/mo for CRM sync |
| 5 | Common Room | Reading Minds | Absorbed Koala; enterprise pricing/complexity |
| 6 | Warmly | Reading Minds | Person-level ID + follow-up still manual |
| 7 | Instantly/Smartlead/Lemlist | Sales Cyborgs / Algo Hacking | Low personalization at scale; reply handling manual |
| 8 | Sierra AI | Rev Autopilot | Complex escalations; $15.8B valuation — crowded top |
| 9 | Jasper/Copy.ai | Ad Factories | Fact-check/editorial manual; 73% can detect AI content |
| 10 | Atyla/findable/Scrunch (GEO) | Algo Hacking / Zero-to-One | Content creation manual; no standard methodology yet |
| 11 | Orb/Lago | Rev Autopilot | Pricing strategy + expansion triggering manual |
| 12 | Nooks | Sales Cyborgs | Conversation quality; new sequencing unreviewed |
| 13 | Motion/Segwise | Ad Factories | Creative production manual; platform encroachment risk |
| 14 | Lindy/Bardeen/Relay | Rev Autopilot / Sales Cyborgs | Edge cases; breaks on layout changes; credit burn |

## Trend signals (last-30-day)
- AI-referred sessions +527% YoY (GEO/AEO live).
- Sierra $950M Series E; Stripe→Metronome ~$1B; Koala shut down; Salesloft–Clari merged.
- Autonomous AI-SDR peaked 2024–25; market reverting to **hybrid human+AI** by early 2026 → a wedge.

## Strategic takeaways for ideation
- **Trust/provenance is the meta-pain** (problems 1,4,6,10): buyers reject invisible AI; "show your evidence" is a wedge.
- **The CRM/loop-closing gap** (problems 2,3): tools observe but don't act+write-back.
- **Voice/conversational is the sponsor center of gravity** (Moss+LiveKit+Nova+MiniMax) — favor ideas with a live voice surface.
- **Measurement honesty** (problems 5,10): a system that proves incremental value, not vanity metrics, is differentiated.
