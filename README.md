# SecureGuard Zambia

Project repository for a generated static website for a concept Zambian security services company. Placeholder brand, imagery and copy only.

## Stack

- Plain HTML, CSS, vanilla JavaScript. No build step, no runtime server, no database.
- Contact form handled by a [Cloudflare Pages Function](https://developers.cloudflare.com/pages/functions/) (`/functions/contact.js`), which forwards submissions to a third-party endpoint (e.g. Formspree) set via an environment variable. If the Page Function is unreachable or unconfigured, the browser falls back to a `mailto:` link.

## Project structure

```
├── index.html            # Single-page site (Hero, About, Services, Why Us, Sectors, Testimonials, Contact, Footer)
├── css/
│   └── style.css         # Mobile-first responsive styles
├── js/
│   └── main.js           # Sticky header, mobile nav, scroll reveal, animated counters, form logic
├── functions/
│   └── contact.js        # Cloudflare Pages Function → POST /contact
├── assets/
│   └── favicon.svg
└── README.md
```

## Run locally

Because this is a static project you can open `index.html` directly, but the Pages Function needs a local runner:

```bash
npx wrangler pages dev .
```

Site: http://localhost:8788. The `/contact` endpoint is only live with the wrangler dev server (or on Cloudflare Pages).

## Deploy to Cloudflare Pages

1. Push this folder to a GitHub repository.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Configure the build:
   - **Project name:** e.g. `secureguard-zambia`
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** leave empty (no build step)
   - **Build output directory:** `/` (the site root; the repo already has `index.html` at root)
   - **Root directory:** `/`
5. Click **Save and Deploy**. Cloudflare Pages automatically detects the `/functions` folder and deploys `contact.js` as a Function.
6. On first visit after deploy, Cloudflare will prompt you to assign a URL to the Functions router — accept the suggested `/*` route (this is normal for Pages with Functions).

### Contact form configuration

The function reads the `FORMSPREE_ENDPOINT` environment variable:

1. Create a free form at [formspree.io](https://formspree.io) and copy its endpoint URL (e.g. `https://formspree.io/f/xxxxx`).
2. In the Pages project, go to **Settings → Environment variables** and add `FORMSPREE_ENDPOINT` with that URL (repeat under **Production** and any preview branches).
3. Redeploy. Form submissions on `/contact` will now be forwarded to Formspree and delivered to the email you configured there.

If `FORMSPREE_ENDPOINT` is not set, the Function still returns success in "demo mode" and `main.js` falls back to opening the visitor's email app with a pre-filled message.

### Custom domain

1. In the Pages project, go to **Custom domains → Set up a custom domain**.
2. Type your domain (e.g. `secureguardzambia.zm` — buy the TLD from any registrar once you actually launch with it).
3. Follow the instructions to update DNS at your registrar with the Cloudflare-assigned nameservers (for Cloudflare-registered domains) or the `CNAME` record Cloudflare shows you (external registrar).
4. Wait for propagation (up to a few hours). Cloudflare auto-provisions a TLS certificate.

### Manual / CLI deployment (alternative)

```bash
npx wrangler pages deploy . --project-name secureguard-zambia
```

## Replacing placeholder imagery

The hero and About images are hot-linked Unsplash CDN placeholders. Replace them with your own licensed photos:

1. Add files under `assets/img/` (e.g. `hero-guard.jpg`, `team.jpg`).
2. In `css/style.css`, change the `url(...)` in the `.hero` background rule.
3. In `index.html`, update the `src` of the About `<img>` and its `alt` text.

## Content notes

- All quotes, names and figures are placeholders.
- Branch addresses/phones are fictional examples — replace before launch.
- Map is an OpenStreetMap embed centred on Lusaka; swap the embed URL for a Google Maps embed if preferred.