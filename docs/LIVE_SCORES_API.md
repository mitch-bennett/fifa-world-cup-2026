# Live scores via a free API — how it would work

> Design write-up (not yet implemented). Companion to `PLAN.md` §10 (Future
> Enhancements) and the data-accuracy policy in `DATA_SOURCES.md`. Tied to the
> current code as of the matches 1-28 ingestion.

## 1. The core problem: why you can't just call the API from React

The app today is a **pure static site** — `schedule.json` is imported at build
time (`src/hooks/useSchedule.js`), baked into the JS bundle, and nginx serves the
result. Nothing runs at runtime.

A live-scores API can't simply be called from the browser, for three reasons:

1. **The API key would be public.** Anything in the React bundle ships to every
   visitor. The key would be visible in DevTools, and anyone could drain the rate
   limit.
2. **CORS.** Most football APIs block direct browser requests (no
   `Access-Control-Allow-Origin`), so `fetch()` from the page fails outright.
3. **Rate limits.** Free tiers are tight (10-100 requests/day). If every page load
   hit the API, the quota would be exhausted by a handful of visitors.

The fix for all three is the same: **a tiny backend that sits between the app and
the API.** It holds the key server-side, adds the CORS header the app needs, and
caches responses so 1,000 visitors cost one upstream request. `PLAN.md` §10 already
anticipates this ("a small backend proxy").

## 2. Free API options

| API | Free tier | Covers WC 2026? | Notes |
|-----|-----------|-----------------|-------|
| **football-data.org** | 10 req/min, no daily cap | Yes — World Cup (`WC`) is in the free competition set | Cleanest JSON, simplest auth (one header). Best fit. |
| **API-Football** (api-sports.io) | 100 req/day | Yes | More data, but daily cap is restrictive and the schema is heavier. |
| **TheSportsDB** | Free with a community key | Partial / less reliable for live | Good fallback, looser data quality. |

Recommendation: **football-data.org** — the per-minute (not per-day) limit plays
nicely with caching, and it's the easiest to integrate.

## 3. Two architectures — and which fits this project

Two genuinely different approaches. They change the app by very different amounts.

### Option A — Build-time / scheduled sync (no runtime backend)

A script fetches results from the API and **rewrites `schedule.json`**, then the
site rebuilds. This is essentially **automating the manual ingest done by hand for
matches 1-28.**

- **What it is:** a Node script (e.g. `scripts/sync-scores.mjs`) run on a schedule
  (cron on the Proxmox host, a GitHub Action, or a scheduled agent / `/loop`). It
  pulls finished matches, maps them to local codes, writes scores into
  `schedule.json`, and triggers a rebuild/redeploy.
- **What changes in the app:** **nothing in the React code.** `useSchedule`,
  `src/utils/standings.js`, and the components are untouched. The data just gets
  fresher automatically.
- **Freshness:** as often as the job runs (e.g. every 30 min). Not truly "live,"
  but ideal for a results site.
- **Tradeoff:** no live ticking scores, but zero added runtime infrastructure and
  zero risk to the current deploy.

### Option B — Runtime proxy (true live scores)

A small always-on service the front-end calls for fresh data.

- **What it is:** a tiny **Node/Express service** (~40 lines) added to
  `docker-compose.yml` as a second container. One endpoint, e.g. `GET /api/scores`,
  which:
  1. holds the API key (from an env var, never in the bundle),
  2. fetches from football-data.org,
  3. caches the response in memory for ~60s,
  4. returns it to the app with CORS allowed.
- **What changes in the app:**
  - `nginx.conf` gains a `location /api/ { proxy_pass http://scores-service:3000; }`
    block so the front-end and API share an origin (no CORS, no separate URL).
  - A new hook `useLiveScores()` does `fetch('/api/scores')` and merges results onto
    the static schedule.
  - `useSchedule` changes from "always trust the JSON" to "JSON is the base; overlay
    live scores where present."
  - Optionally a `ScoresPanel` component replaces/augments `ScoresLinks.jsx` to show
    live scores instead of just out-links.
- **Tradeoff:** real live updates, but a second container to run and maintain, plus a
  live network dependency (need graceful fallback to the static JSON when the API is
  down).

## 4. The hidden hard part (true for both options): team-code mapping

This is the part most people underestimate. The schedule keys teams as `MEX`, `RSA`,
`SUI`, `HAI` — **FIFA/IOC codes** (note `RSA` = South Africa, `SUI` = Switzerland,
**not** ISO `ZAF`/`CHE`). football-data.org identifies teams by its **own numeric IDs
and its own three-letter abbreviations**, which frequently differ.

So any sync needs a **mapping table** — e.g. `src/data/team-id-map.json` —
translating the API's team identifier → local code. Built once (48 teams), it's the
thing most likely to silently break (a mis-mapped team just never gets its score).
Upside: the manual verification already done gives ground truth to check the mapping
against.

## 5. Recommendation for this setup

Given a **static site on a home Proxmox/Portainer box** and a results/standings site
(not a betting ticker), **Option A (scheduled sync) is the better fit:**

- Keeps the architecture exactly as-is — still a static site, still one container,
  nothing new to break.
- Directly retires the manual ingest chore, which is the actual pain point.
- `src/utils/standings.js` auto-computation already lights up the moment scores land
  in the JSON — fresher JSON automatically means fresher tables, no code changes.
- Can later "upgrade" to Option B for second-by-second scores; the team-code map
  built now carries straight over.

The honest catch for **both** options: the data-accuracy policy in `DATA_SOURCES.md`
(verify before publishing) shifts from *human-verified* to *trust the API*. Likely
soften `data-status.json`'s `status` to something like `auto-synced`, and lean on the
mapping table plus sanity checks (e.g. reject implausible scores) as guardrails.

## 6. Sketch — Option A pieces (for when we build it)

```
scripts/sync-scores.mjs        # fetch finished WC matches, map codes, patch schedule.json
src/data/team-id-map.json      # football-data.org team id/TLA -> local FIFA/IOC code
```

Rough flow of `sync-scores.mjs`:

1. `GET https://api.football-data.org/v4/competitions/WC/matches?status=FINISHED`
   with header `X-Auth-Token: <key>`.
2. For each finished match, resolve both teams via `team-id-map.json` → local codes.
3. Find the corresponding row in `schedule.json` (match by the two team codes +
   date), and set `homeScore` / `awayScore` if not already present.
4. Sanity-check (codes resolved, scores are finite, plausible range), write
   `schedule.json`, update `data-status.json` (`lastUpdated`, coverage note).
5. Commit + redeploy (or just rebuild the container).
