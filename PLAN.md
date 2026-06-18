# FIFA World Cup 2026 — Interactive Map Website Plan

## 1. Overview

A website featuring an interactive, visual world map of the countries participating
in the 2026 FIFA World Cup. Users can spin a 3D globe, click a country to open a rich
country/team profile, browse the tournament groups, and view the schedule. Live and
recent scores are surfaced via links to external sources (with a free-API integration
kept as a documented future enhancement).

Deployed locally as a static site inside a Docker container.

## 2. Locked Decisions

| Area | Decision |
|------|----------|
| Frontend stack | **React + Vite** |
| 3D globe | **`react-globe.gl`** (wraps three.js / globe.gl) |
| 2D map | **`react-leaflet`** (Leaflet + OpenStreetMap tiles) |
| Routing | **React Router** |
| Data source | **Static local JSON** bundled in the app |
| Country/team detail | **Rich profile** (country facts + team info + fixtures + mini-globe + 2D map) |
| Live scores | **Link out** to FIFA/ESPN/Google now; **free-API integration documented as future work** |
| Deployment | **Docker**, multi-stage build → static files served by **nginx** |

## 3. Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Globe / Home** | Full-screen interactive globe. Participating countries are highlighted/marked. Click a country → navigate to its profile. Spin, zoom, hover for name tooltip. |
| `/country/:code` | **Country / Team Profile** | Rich profile (see §5). Includes a **mini-globe** centered/highlighted on the country and a **2D Leaflet map** of the country and surrounding area. |
| `/groups` | **Groups Overview** | All 12 groups (A–L) summarized as cards/tables. Clicking a country shows a summary (same `CountrySummary` component used elsewhere). |
| `/schedule` | **Schedule** | Embedded match schedule (from static JSON), filterable by group/date/team. Prominent links to live & recent scores. |
| `*` | **404 / Not Found** | Fallback. |

## 4. Shared Components (reuse is the whole point of React here)

- `Globe` — main interactive globe (home page).
- `MiniGlobe` — small non-interactive (or lightly interactive) globe that highlights one country; reused on every country profile.
- `CountrySummary` — compact summary card (flag, group, rank, next match). Reused by the globe click-through preview AND the groups page.
- `CountryMap2D` — `react-leaflet` map focused on one country + surrounding region.
- `ScheduleTable` / `MatchCard` — schedule rendering.
- `ScoresLinks` — buttons linking to external live/recent scores.
- `GroupCard` — one group's standings/teams.
- `Layout` / `NavBar` — shared chrome and navigation.

## 5. "Rich Profile" Content (per country/team)

**Country facts:** flag, official name, capital, population, region, languages, brief blurb.
**Team info:** FIFA ranking, confederation, group, head coach, key players, qualification note, prior WC appearances/best finish.
**Fixtures:** this team's matches (date, opponent, venue, group), pulled from the schedule JSON.
**Visuals:** `MiniGlobe` highlighting the country + `CountryMap2D` showing the country and surrounding area.
**Scores:** `ScoresLinks` for live/recent results.

## 6. Data Model (static JSON in `src/data/`)

```
src/data/
  countries.json     # keyed by ISO code: facts, lat/lng, team info, group
  groups.json        # groups A–L → list of country codes + standings
  schedule.json      # matches: id, date, group, home, away, venue, city
  venues.json        # (optional) host cities/stadiums for map markers
```

**`countries.json` (per entry) shape:**
```json
{
  "code": "BRA",
  "name": "Brazil",
  "flag": "🇧🇷",
  "capital": "Brasília",
  "population": 214000000,
  "region": "South America",
  "languages": ["Portuguese"],
  "blurb": "...",
  "lat": -14.235,
  "lng": -51.925,
  "team": {
    "fifaRank": 5,
    "confederation": "CONMEBOL",
    "group": "C",
    "coach": "...",
    "keyPlayers": ["...", "..."],
    "bestFinish": "Winners (×5)"
  }
}
```

> Note: 2026 expands to **48 teams across 12 groups (A–L)**, hosted by USA, Canada, Mexico.
> JSON is hand-editable so data can be corrected/updated as qualification finalizes.

## 7. Project Structure

```
fifa-world-cup-2026/
├── index.html
├── package.json
├── vite.config.js
├── Dockerfile
├── nginx.conf
├── .dockerignore
├── public/
│   └── (static assets, flag images if not using emoji, textures)
├── src/
│   ├── main.jsx
│   ├── App.jsx                # Router + Layout
│   ├── data/                  # countries.json, groups.json, schedule.json
│   ├── components/            # Globe, MiniGlobe, CountrySummary, CountryMap2D, ...
│   ├── pages/                 # Home, CountryProfile, Groups, Schedule, NotFound
│   ├── hooks/                 # useCountries, useSchedule (load + index JSON)
│   └── styles/
└── PLAN.md
```

## 8. Implementation Phases

**Phase 0 — Scaffold & tooling**
- Replace the Python template with a Node/React app (or keep Python files aside; this is a web project).
- `npm create vite@latest` (React), add `react-router-dom`, `react-globe.gl`, `three`, `react-leaflet`, `leaflet`.
- Set up `Layout`, `NavBar`, routing skeleton with placeholder pages.

**Phase 1 — Data layer**
- Build `countries.json`, `groups.json`, `schedule.json` (start with a partial real dataset; structure first, fill data progressively).
- `useCountries` / `useSchedule` hooks to load and index by code/group.

**Phase 2 — Globe (home)**
- `react-globe.gl` with participating countries as points/polygons.
- Hover tooltip (country name), click → `navigate('/country/CODE')`.
- Optional: highlight only participating nations.

**Phase 3 — Country profile**
- `CountryProfile` page composing facts + team info + fixtures.
- `MiniGlobe` highlighting the country.
- `CountryMap2D` (`react-leaflet`) centered on country with surrounding area.
- `ScoresLinks`.

**Phase 4 — Groups overview**
- `GroupCard` per group; `CountrySummary` reused on country click.

**Phase 5 — Schedule**
- `ScheduleTable` from `schedule.json`, filters, `ScoresLinks` prominent.

**Phase 6 — Polish**
- Responsive layout, loading/empty states, styling pass, performance (lazy-load globe/map, code-split routes).

**Phase 7 — Dockerize**
- Multi-stage Dockerfile (build with Node → serve `dist/` with nginx).
- `nginx.conf` with SPA fallback (`try_files ... /index.html`).
- `docker build` + `docker run -p 8080:80`.

## 9. Docker — local LAN deployment to Portainer

The app builds via a multi-stage `Dockerfile` (Node builds Vite → nginx serves `dist/`,
with `nginx.conf` providing SPA fallback so deep links like `/country/BRA` survive a
refresh). For a home server (Proxmox LXC running Docker + Portainer), the simplest path
is a LAN-only stack reachable at `http://<lxc-ip>:8080`:

1. Give the LXC a **static IP** (or DHCP reservation) so the URL is stable.
2. Portainer → **Stacks → Add stack → Git repository**, point at this repo, set the
   **Compose path** to `docker-compose.lan.yml`, and **Deploy**. Portainer clones and
   builds the Dockerfile on the host.
3. Visit `http://<lxc-ip>:8080`. Re-deploy to pull the latest commit.

This is LAN-only by default: publishing a port makes it reachable on your home network
but not from the internet (the router doesn't forward inbound traffic unless told to).

> **Full deployment reference → `DEPLOYMENT.md`**: detailed Docker build, building
> off-host, **external access** (Tailscale / Cloudflare Tunnel), and running **multiple
> website stacks** — Option A (different ports) and Option B (one Nginx Proxy Manager
> reverse proxy routing by hostname). Repo includes `docker-compose.yml` (proxy-ready),
> `docker-compose.lan.yml` (simple LAN), and `deploy/nginx-proxy-manager/`.

## 10. Future Enhancements (documented, not built now)

- **Live scores via free API** (football-data.org or API-Football free tier). Requires an
  API key + a small backend proxy (e.g. a tiny Node/Express service added to docker-compose)
  to keep the key server-side and handle rate limits/caching. Swap `ScoresLinks` for a live
  `ScoresPanel`.
- Group standings auto-computed from match results.
- Flag images / country silhouettes instead of emoji.
- i18n, dark mode, knockout-bracket view.

## 11. Open Items / Assumptions

- Globe interaction style: confirm whether clicking should open the profile directly, or
  first show a `CountrySummary` hover/popover then navigate. (Plan supports both.)
- Data completeness: dataset will be filled incrementally; structure is finalized first.
- Note: the existing repo is a Python/Anthropic-API template — this web project largely
  replaces its contents (we can preserve the Python files in a subfolder if you want).
```
