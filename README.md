# HOODSTREET — landing page

Static site, no build step. One page: `index.html` + `style.css` + `script.js` + `assets/`.

## Run locally

```bash
cd hoodstreet
python3 -m http.server 8080
# → http://localhost:8080
```

## Deploy to GitHub Pages (new repo)

1. Create a public repo named `hoodstreet` under your account.
2. Push this folder as the repo root:

```bash
cd hoodstreet
git init -b main
git add .
git commit -m "HoodStreet landing page"
git remote add origin https://github.com/<your-username>/hoodstreet.git
git push -u origin main
```

3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → Save.
4. Live in about a minute at `https://<your-username>.github.io/hoodstreet/`.

No workflow files, no build — the `.nojekyll` file keeps Pages from processing the folder with Jekyll.

## Custom domain

Live at `https://hstreet.xyz` — the `CNAME` file in the repo root sets it.

When the DNS is ready:

1. Add a file named `CNAME` (no extension) containing exactly your domain (e.g. `hstreet.xyz`).
2. At your DNS provider, point the apex domain to GitHub Pages:
   - A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Optional AAAA records: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `www` → CNAME → `<your-username>.github.io`
3. Repo → Settings → Pages → Custom domain → your domain → wait for the check → enable **Enforce HTTPS**.

Don't add the `CNAME` file before the DNS records exist, or the `*.github.io` URL will start redirecting to a domain that isn't resolving yet.

## Tweaks

- **Name**: lives in `index.html` (title, meta, entrance, nav, footer). Find/replace "HoodStreet".
- **Links**: the mint button and every X link are set from `LINKS` at the top of `script.js`.
- **Art**: swap files in `assets/` — square webp looks best. The eight one-of-ones are 1231 (Bouncer), 1347 (HS-01), 1680 (Kingpin), 2199 (Madam), 2441 (Mob boss), 2493 (Unc), 2548 (Vampire), 3982 (Werewolf).
- **Entrance screen**: remove the `<section id="entrance">` block and the `class="entrance-active"` on `<body>` if you want the page to open directly on the hero.
- **Copy**: every headline, stat and FAQ answer is plain text in `index.html`.
