# Deployment Guide (Portainer + Proxmox LXC)

This guide is safe to publish publicly. Keep hostnames, IPs, tokens, and private URLs in local-only notes.

## 1) Repo Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build: Vite build -> nginx static hosting |
| `nginx.conf` | SPA fallback for deep-link refreshes |
| `docker-compose.lan.yml` | LAN deployment with published port |
| `docker-compose.yml` | Reverse-proxy deployment on external `proxy` network |
| `deploy/nginx-proxy-manager/docker-compose.yml` | Optional Nginx Proxy Manager stack |

## 2) Safe Public Docs Pattern

Use placeholders in committed docs:
- `<REPO_URL>`
- `<STACK_NAME>`
- `<HOST_IP>`
- `<DOMAIN_NAME>`

Do not commit:
- Private repo URLs with embedded credentials
- Tailscale auth keys or Cloudflare tunnel tokens
- Internal DNS records or infrastructure notes tied to your home network

Store private deployment notes in a local untracked file, for example `deploy/PRIVATE_NOTES.local.md`.

## 3) Portainer Deployment (Git)

1. Push this repository to GitHub.
2. Portainer -> `Stacks` -> `Add stack`.
3. Choose `Git repository`.
4. Set:
   - Repository URL: `<REPO_URL>`
   - Compose path: `docker-compose.lan.yml`
   - Stack name: `<STACK_NAME>`
5. Deploy.
6. Open: `http://<HOST_IP>:8080`

Update cycle:
1. `git push origin main`
2. Portainer: `Pull and redeploy`

## 4) Deep-Link Smoke Test

After deploy, verify these direct URLs load on refresh:
- `http://<HOST_IP>:8080/`
- `http://<HOST_IP>:8080/groups`
- `http://<HOST_IP>:8080/schedule`
- `http://<HOST_IP>:8080/country/USA`

If refresh fails, confirm `nginx.conf` includes:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 5) Optional Reverse Proxy Mode

Use `docker-compose.yml` when a shared reverse proxy is already running.

One-time network setup on Docker host:

```bash
docker network create proxy
```

Then point your reverse proxy to container `wc2026` on port `80`.

## 6) Local Docker Check

```bash
docker compose -f docker-compose.lan.yml up --build
```

Open `http://localhost:8080`.
