# Deployment Guide

Detailed deployment for the FIFA World Cup 2026 site on a Proxmox home server
(LXC container running Docker + Portainer). Covers the Docker build, Portainer
deployment, external access options, and running multiple website stacks side by side.

> For the quick LAN-only summary, see `PLAN.md` §9. This file is the full reference.

---

## 1. Files in this repo

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build: Node builds the Vite site → nginx serves `dist/`. |
| `nginx.conf` | nginx config with SPA fallback (deep links like `/country/BRA` work on refresh). |
| `docker-compose.yml` | **Proxy-ready** stack. No published ports; joins external `proxy` network. |
| `docker-compose.lan.yml` | **Simple LAN** stack. Publishes port `8080`. No reverse proxy needed. |
| `deploy/nginx-proxy-manager/docker-compose.yml` | Nginx Proxy Manager — one reverse proxy for all your sites. |

> The compose files use `build: .`, so the React app must exist (Phase 0 of `PLAN.md`).
> Before there's app source, `npm run build` has nothing to build.

---

## 2. Building & running with plain Docker (no Portainer)

```bash
# From the repo root, on the LXC (or any Docker host):
docker build -t wc2026 .
docker run --rm -p 8080:80 wc2026     # visit http://<host-ip>:8080
```

This is handy for a quick test. For a managed, restart-on-boot deployment, use a
compose stack (below) instead of `docker run`.

---

## 3. Deploying to Portainer

### 3a. Simple LAN deployment (recommended starting point)

Self-contained, no reverse proxy, reachable at `http://<lxc-ip>:8080`.

1. Give the LXC a **static IP** (Proxmox) or a DHCP reservation, so the URL is stable.
2. Portainer → **Stacks → Add stack**.
3. Build method:
   - **Git repository** (preferred): point at this repo, set **Compose path** to
     `docker-compose.lan.yml`. Portainer clones and builds the Dockerfile on the host.
     Private repo? Add credentials/deploy token in the Git config.
   - **Web editor**: paste the contents of `docker-compose.lan.yml` (you'll still need
     the build context — Git method is cleaner when building from a Dockerfile).
4. **Deploy**. Visit `http://<lxc-ip>:8080`.

Re-deploying the stack (or "Pull and redeploy") rebuilds from the latest commit.

### 3b. Build elsewhere, run the image

If you'd rather not build on the LXC:

```bash
# On your Mac:
docker build -t wc2026:latest .
# Option 1: push to a registry (Docker Hub private repo / local registry), then
#           reference image: wc2026:latest in compose with no `build:` line.
# Option 2: docker save wc2026:latest | gzip > wc2026.tar.gz
#           copy to the LXC, then: docker load < wc2026.tar.gz
```

---

## 4. Why LAN-only is the default

When a container publishes a port (`8080:80`), Docker binds it to the LXC's IP on your
home network. Your router does **not** forward inbound internet traffic unless you
explicitly set up port forwarding or a tunnel. So:

- **Publish a port → reachable on your LAN, invisible from the internet.** No extra work.
- You only become externally visible if you deliberately add one of the options in §5.

---

## 5. External access (only if you want it)

Ranked easiest/safest first. None of these require opening router ports.

### 5a. Tailscale — best for "just me / my own devices, anywhere"

Install Tailscale on the LXC (or as a sidecar container) and on your phone/laptop. They
join the same private tailnet; reach the site at `http://<tailscale-ip>:8080` (or use
Tailscale Serve for automatic HTTPS). **Nothing is exposed publicly.** Closest match to
"only from home, plus my devices when away." ~10-minute setup.

### 5b. Cloudflare Tunnel — best for a real public URL with a login wall

Run `cloudflared` as a container pointed at the site (or at NPM). You get
`https://worldcup.yourdomain.com` with automatic HTTPS, **no port forwarding, home IP
never exposed**. Add **Cloudflare Access** to gate it behind an email/Google login.
Requires a domain on Cloudflare. Example service to add to a stack:

```yaml
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: unless-stopped
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=<token-from-cloudflare-zero-trust-dashboard>
    networks:
      - proxy   # so it can reach wc2026:80 or the NPM proxy
```

### 5c. Router port-forwarding + reverse proxy + DDNS — not recommended

The old-school route: forward 443, run a reverse proxy for TLS, use DDNS for your
changing home IP. This genuinely exposes your home IP and is the most work/risk. Prefer
5a or 5b.

---

## 6. Running multiple website stacks on the same host

Each stack that publishes the same port (e.g. `8080`) will collide. Two ways to solve it.

### Option A — Different ports per site (simplest)

Give each site its own host port. No extra infrastructure.

| Site | compose `ports:` | URL |
|------|------------------|-----|
| World Cup | `"8080:80"` | `http://<lxc-ip>:8080` |
| Site B    | `"8081:80"` | `http://<lxc-ip>:8081` |
| Site C    | `"8082:80"` | `http://<lxc-ip>:8082` |

Use `docker-compose.lan.yml` and just change the left-hand port number per site.
Downsides: ugly IP:port URLs, no central HTTPS. Fine for 2–4 personal LAN sites.

### Option B — One reverse proxy, route by hostname (the scalable answer)

Run **one** Nginx Proxy Manager (NPM) that owns ports 80/443 and routes to each site by
hostname over a shared Docker network. Sites publish **no** host ports.

**1. Create the shared network once** (host/LXC shell, or Portainer → Networks):
```bash
docker network create proxy
```

**2. Deploy the NPM stack** from `deploy/nginx-proxy-manager/docker-compose.yml` as its
own Portainer stack. Then open `http://<lxc-ip>:81` (default `admin@example.com` /
`changeme` — change it immediately).

**3. Deploy each site with its proxy-ready compose** (this repo's `docker-compose.yml`):
no `ports:`, joins the external `proxy` network. Each site keeps a unique
`container_name` (e.g. `wc2026`, `siteb`, `sitec`).

**4. Add a Proxy Host in NPM** per site:
- Domain: `worldcup.home` → Forward Hostname `wc2026`, Forward Port `80`
- Domain: `siteb.home`    → Forward Hostname `siteb`,  Forward Port `80`

**5. Make the hostnames resolve on your LAN.** Pick one:
- **Pi-hole / AdGuard Home**: add local DNS records → point names at the LXC IP. Best:
  works for every device automatically.
- **Router static DNS entries**: if your router supports hostname→IP mappings.
- **`/etc/hosts`** on each device: quick, but per-device manual edits.
- **Real domain via Cloudflare**: only if going public (pairs with §5b).

Result: `http://worldcup.home`, `http://siteb.home`, … all on port 80, no port juggling,
optional Let's Encrypt HTTPS managed in one place. Adding a new site = join the `proxy`
network + add one Proxy Host entry.

### Which option?

- **2–4 sites, LAN only, don't care about names:** Option A.
- **Growing collection / want clean names / HTTPS / future public access:** Option B with
  NPM + Pi-hole (or router DNS). Standard homelab pattern; composes with §5 (put Tailscale
  or Cloudflare Tunnel in front of NPM once, and every site behind it benefits).

---

## 7. Quick reference

```bash
# One-time, for Option B:
docker network create proxy

# Plain test:
docker build -t wc2026 . && docker run --rm -p 8080:80 wc2026

# Simple LAN stack:        docker-compose.lan.yml   -> http://<lxc-ip>:8080
# Proxy-ready stack:       docker-compose.yml       -> reached by NPM as wc2026:80
# Reverse proxy stack:     deploy/nginx-proxy-manager/docker-compose.yml -> admin :81
```
