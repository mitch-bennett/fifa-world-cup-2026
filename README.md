# FIFA World Cup 2026 Atlas

Interactive React website for exploring 2026 FIFA World Cup teams, groups, and fixtures.

## Features

- Interactive 3D globe with selectable teams
- Country profile pages with facts, team details, mini-globe, and map
- Groups page with team selection and standings table layout
- Schedule page with filters and table/card views
- External quick links for live and recent scores

## Tech Stack

- React + Vite
- React Router
- react-globe.gl / three.js
- react-leaflet + Leaflet
- Docker + nginx

## Run Locally

```bash
npm install
npm run dev
```

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
