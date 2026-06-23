# FIFA World Cup 2026 Atlas

Interactive React website for exploring 2026 FIFA World Cup teams, groups, and fixtures.

## Features

- Interactive 3D globe with selectable teams (clickable flag-emoji markers)
- Country profile pages with facts, team details, mini-globe, and an
  English-labeled capital map
- Groups page with team selection and standings table layout
- Schedule page with filters and table/card views
- External quick links for live and recent scores

## Tech Stack

- React + Vite
- React Router
- react-globe.gl / three.js
- MapLibre GL (vector tiles)
- Docker + nginx

## Run Locally

```bash
npm install
npm run dev
```

## Map Tiles (English Labels)

The country-page maps use MapLibre GL vector tiles and relabel them to English
(`name:en`, falling back to a Latin transliteration). English labels require a
free [Geoapify](https://www.geoapify.com/) API key (free tier: 3,000 tiles/day):

```bash
cp .env.example .env
# paste your key after VITE_GEOAPIFY_KEY=
```

The key is read by Vite at build time (note the `VITE_` prefix). Without a key
the maps fall back to plain OpenStreetMap raster tiles, which show place names in
each region's local language. For Docker, the key is forwarded as a build arg —
see the Deployment Guide.

## Production Build

```bash
npm run build
npm run preview
```

## Docker

```bash
docker compose -f docker-compose.lan.yml up --build
```

App URL: `http://localhost:8080`

## Routes

- `/`
- `/country/:code`
- `/groups`
- `/schedule`
